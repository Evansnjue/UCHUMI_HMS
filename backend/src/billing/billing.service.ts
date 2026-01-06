import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { BillingItem } from './entities/billing-item.entity';
import { Payment } from './entities/payment.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { EventBusService } from '../auth/event-bus.service';
import { InvoiceGeneratedEvent, PaymentReceivedEvent } from './events/billing.events';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    @InjectRepository(Invoice) private invoiceRepo: Repository<Invoice>,
    @InjectRepository(BillingItem) private itemRepo: Repository<BillingItem>,
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    private eventBus: EventBusService,
  ) {}

  /** Create an invoice: auto calculate totals and store billing items */
  async generateInvoice(dto: CreateInvoiceDto, createdBy: string) {
    if (!dto.items || dto.items.length === 0) throw new BadRequestException('Invoice items required');

    const invoice = this.invoiceRepo.create({ patient: dto.patientId ? ({ id: dto.patientId } as any) : null, insuranceProvider: dto.insuranceProvider || null } as any);
    invoice.items = dto.items.map((it) => this.itemRepo.create({ description: it.description, quantity: it.quantity, unitPrice: it.unitPrice, total: Number(it.quantity) * Number(it.unitPrice) } as any));

    invoice.totalAmount = invoice.items.reduce((s, it) => s + Number(it.total), 0);
    invoice.insuranceCoveredAmount = dto.insuranceCoveredAmount || 0;
    invoice.patientResponsible = Number(invoice.totalAmount) - Number(invoice.insuranceCoveredAmount || 0);

    const saved = await this.invoiceRepo.save(invoice);

    // Emit InvoiceGenerated
    const evt: InvoiceGeneratedEvent = {
      invoiceId: saved.id,
      patientId: saved.patient?.id,
      totalAmount: Number(saved.totalAmount),
      items: saved.items.map((i) => ({ description: i.description, quantity: Number(i.quantity), unitPrice: Number(i.unitPrice), total: Number(i.total) })),
      createdAt: new Date().toISOString(),
    };
    this.eventBus.publish('InvoiceGenerated', evt);

    await this.invoiceRepo.manager.query(`INSERT INTO pharmacy_audit(event_type, payload) VALUES ($1,$2)`, ['InvoiceGenerated', JSON.stringify(evt)]);

    return saved;
  }

  async getInvoice(id: string) {
    const inv = await this.invoiceRepo.findOne({ where: { id }, relations: ['items', 'patient'] });
    if (!inv) throw new NotFoundException('Invoice not found');
    return inv;
  }

  async listInvoices(limit = 50, offset = 0) {
    return this.invoiceRepo.find({ take: limit, skip: offset, relations: ['items', 'patient'] });
  }

  async recordPayment(dto: CreatePaymentDto, receivedBy: string) {
    const invoice = await this.invoiceRepo.findOne({ where: { id: dto.invoiceId }, relations: ['items'] });
    if (!invoice) throw new NotFoundException('Invoice not found');

    const payment = this.paymentRepo.create({ invoice: invoice as any, amount: dto.amount, method: dto.method, provider: dto.provider, reference: dto.reference, receivedBy: { id: receivedBy } } as any);
    const saved = await this.paymentRepo.save(payment);

    // Update invoice status & prevent overpayment
    const totalPaidRaw = (await this.paymentRepo.createQueryBuilder('p').select('SUM(p.amount)', 'sum').where('p.invoice_id = :id', { id: invoice.id }).getRawOne()).sum || 0;
    const paid = Number(totalPaidRaw);

    // Prevent overpayment: if paid > totalAmount, reject
    if (paid > Number(invoice.totalAmount)) {
      // remove the saved payment to keep data consistent
      await this.paymentRepo.delete({ id: saved.id }).catch(() => {});
      throw new BadRequestException('Overpayment: amount exceeds invoice total');
    }

    if (paid >= Number(invoice.totalAmount)) {
      invoice.status = 'PAID';
    } else if (paid > 0) {
      invoice.status = 'PARTIAL';
    }
    await this.invoiceRepo.save(invoice);

    // Emit PaymentReceived
    const evt: PaymentReceivedEvent = { paymentId: saved.id, invoiceId: invoice.id, amount: Number(saved.amount), method: saved.method, provider: saved.provider, receivedAt: new Date().toISOString() };
    this.eventBus.publish('PaymentReceived', evt);
    await this.paymentRepo.manager.query(`INSERT INTO pharmacy_audit(event_type, payload) VALUES ($1,$2)`, ['PaymentReceived', JSON.stringify(evt)]);

    return saved;
  }

  async revenueReport(period: 'day' | 'week' | 'month') {
    // Simple implementation using payments table
    let q = this.paymentRepo.createQueryBuilder('p');
    const now = new Date();
    let start: Date;
    if (period === 'day') {
      start = new Date(now); start.setHours(0,0,0,0);
    } else if (period === 'week') {
      const d = new Date(now); const day = d.getDay(); d.setDate(d.getDate() - day); d.setHours(0,0,0,0); start = d;
    } else {
      const d = new Date(now); d.setDate(1); d.setHours(0,0,0,0); start = d;
    }

    const raw = await q.select('SUM(p.amount)::numeric', 'total').where('p.received_at >= :start', { start: start.toISOString() }).getRawOne();
    return { period, total: Number(raw.total || 0) };
  }

  /**
   * Reconciliation stub: list unpaid invoices with insurance provider (claims pending)
   */
  async unpaidInsuranceClaims() {
    return this.invoiceRepo.createQueryBuilder('i').where('i.insurance_provider IS NOT NULL').andWhere("i.status != 'PAID'").getMany();
  }
}
