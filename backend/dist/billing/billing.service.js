var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var BillingService_1;
import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { BillingItem } from './entities/billing-item.entity';
import { Payment } from './entities/payment.entity';
import { EventBusService } from '../auth/event-bus.service';
let BillingService = BillingService_1 = class BillingService {
    constructor(invoiceRepo, itemRepo, paymentRepo, eventBus) {
        this.invoiceRepo = invoiceRepo;
        this.itemRepo = itemRepo;
        this.paymentRepo = paymentRepo;
        this.eventBus = eventBus;
        this.logger = new Logger(BillingService_1.name);
    }
    /** Create an invoice: auto calculate totals and store billing items */
    async generateInvoice(dto, createdBy) {
        if (!dto.items || dto.items.length === 0)
            throw new BadRequestException('Invoice items required');
        const invoice = this.invoiceRepo.create({ patient: dto.patientId ? { id: dto.patientId } : null, insuranceProvider: dto.insuranceProvider || null });
        invoice.items = dto.items.map((it) => this.itemRepo.create({ description: it.description, quantity: it.quantity, unitPrice: it.unitPrice, total: Number(it.quantity) * Number(it.unitPrice) }));
        invoice.totalAmount = invoice.items.reduce((s, it) => s + Number(it.total), 0);
        invoice.insuranceCoveredAmount = dto.insuranceCoveredAmount || 0;
        invoice.patientResponsible = Number(invoice.totalAmount) - Number(invoice.insuranceCoveredAmount || 0);
        const saved = (await this.invoiceRepo.save(invoice));
        // Emit InvoiceGenerated
        const evt = {
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
    async getInvoice(id) {
        const inv = await this.invoiceRepo.findOne({ where: { id }, relations: ['items', 'patient'] });
        if (!inv)
            throw new NotFoundException('Invoice not found');
        return inv;
    }
    async listInvoices(limit = 50, offset = 0) {
        return this.invoiceRepo.find({ take: limit, skip: offset, relations: ['items', 'patient'] });
    }
    async recordPayment(dto, receivedBy) {
        const invoice = await this.invoiceRepo.findOne({ where: { id: dto.invoiceId }, relations: ['items'] });
        if (!invoice)
            throw new NotFoundException('Invoice not found');
        const payment = this.paymentRepo.create({ invoice: invoice, amount: dto.amount, method: dto.method, provider: dto.provider, reference: dto.reference, receivedBy: { id: receivedBy } });
        const saved = (await this.paymentRepo.save(payment));
        // Update invoice status & prevent overpayment
        const totalPaidRaw = (await this.paymentRepo.createQueryBuilder('p').select('SUM(p.amount)', 'sum').where('p.invoice_id = :id', { id: invoice.id }).getRawOne()).sum || 0;
        const paid = Number(totalPaidRaw);
        // Prevent overpayment: if paid > totalAmount, reject
        if (paid > Number(invoice.totalAmount)) {
            // remove the saved payment to keep data consistent
            await this.paymentRepo.delete({ id: saved.id }).catch(() => { });
            throw new BadRequestException('Overpayment: amount exceeds invoice total');
        }
        if (paid >= Number(invoice.totalAmount)) {
            invoice.status = 'PAID';
        }
        else if (paid > 0) {
            invoice.status = 'PARTIAL';
        }
        await this.invoiceRepo.save(invoice);
        // Emit PaymentReceived
        const evt = { paymentId: saved.id, invoiceId: invoice.id, amount: Number(saved.amount), method: saved.method, provider: saved.provider, receivedAt: new Date().toISOString() };
        this.eventBus.publish('PaymentReceived', evt);
        await this.paymentRepo.manager.query(`INSERT INTO pharmacy_audit(event_type, payload) VALUES ($1,$2)`, ['PaymentReceived', JSON.stringify(evt)]);
        return saved;
    }
    async revenueReport(period) {
        // Simple implementation using payments table
        let q = this.paymentRepo.createQueryBuilder('p');
        const now = new Date();
        let start;
        if (period === 'day') {
            start = new Date(now);
            start.setHours(0, 0, 0, 0);
        }
        else if (period === 'week') {
            const d = new Date(now);
            const day = d.getDay();
            d.setDate(d.getDate() - day);
            d.setHours(0, 0, 0, 0);
            start = d;
        }
        else {
            const d = new Date(now);
            d.setDate(1);
            d.setHours(0, 0, 0, 0);
            start = d;
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
};
BillingService = BillingService_1 = __decorate([
    Injectable(),
    __param(0, InjectRepository(Invoice)),
    __param(1, InjectRepository(BillingItem)),
    __param(2, InjectRepository(Payment)),
    __metadata("design:paramtypes", [Repository,
        Repository,
        Repository,
        EventBusService])
], BillingService);
export { BillingService };
//# sourceMappingURL=billing.service.js.map