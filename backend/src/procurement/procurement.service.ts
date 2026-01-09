import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { CreatePODto, ApprovePODto } from './dto/create-po.dto';
import { EventBusService } from '../auth/event-bus.service';
import { PurchaseOrderCreatedEvent } from './procurement.events';

@Injectable()
export class ProcurementService {
  constructor(
    @InjectRepository(Supplier) private supplierRepo: Repository<Supplier>,
    @InjectRepository(PurchaseOrder) private poRepo: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderItem) private itemRepo: Repository<PurchaseOrderItem>,
    private eventBus: EventBusService,
  ) {}

  async createSupplier(dto: CreateSupplierDto) {
    const s = this.supplierRepo.create(dto as any);
    return this.supplierRepo.save(s);
  }

  async getSupplier(id: string) {
    const s = await this.supplierRepo.findOne({ where: { id } });
    if (!s) throw new NotFoundException('supplier not found');
    return s;
  }

  async createPurchaseOrder(dto: CreatePODto, actorId: string) {
    const supplier = await this.supplierRepo.findOne({ where: { id: dto.supplierId } });
    if (!supplier) throw new NotFoundException('supplier not found');

    const items = dto.items.map((it: any) => ({ description: it.description, quantity: it.quantity, unitPrice: it.unitPrice, totalPrice: Number(it.quantity) * Number(it.unitPrice) }));
    const total = items.reduce((sum: number, it: any) => sum + Number(it.totalPrice), 0);

    const po: PurchaseOrder = this.poRepo.create({ supplier, createdBy: actorId, totalAmount: total, currency: dto.currency || 'USD', status: 'PENDING', items } as any) as unknown as PurchaseOrder;
    const saved: PurchaseOrder = await this.poRepo.save(po) as unknown as PurchaseOrder;

    // publish event
    const ev: PurchaseOrderCreatedEvent = { purchaseOrderId: saved.id, supplierId: supplier.id, totalAmount: Number(saved.totalAmount) };
    this.eventBus.publish('PurchaseOrderCreated', ev);

    return saved;
  }

  async approvePurchaseOrder(poId: string, dto: ApprovePODto, approverId: string) {
    const po = await this.poRepo.findOne({ where: { id: poId }, relations: ['supplier', 'items'] });
    if (!po) throw new NotFoundException('purchase order not found');
    if (po.status !== 'PENDING') throw new BadRequestException('purchase order not in pending state');

    po.status = 'APPROVED';
    po.approvedBy = approverId;
    po.approvedAt = new Date();
    const saved = await this.poRepo.save(po);
    return saved;
  }

  async listPurchaseOrders(filter?: { status?: string, supplierId?: string }) {
    const qb = this.poRepo.createQueryBuilder('p').leftJoinAndSelect('p.supplier', 's').leftJoinAndSelect('p.items', 'i');
    if (filter?.status) qb.where('p.status = :s', { s: filter.status });
    if (filter?.supplierId) qb.andWhere('p.supplier_id = :id', { id: filter.supplierId });
    qb.orderBy('p.created_at', 'DESC');
    return qb.getMany();
  }
}
