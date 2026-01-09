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
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity';
import { EventBusService } from '../auth/event-bus.service';
let ProcurementService = class ProcurementService {
    constructor(supplierRepo, poRepo, itemRepo, eventBus) {
        this.supplierRepo = supplierRepo;
        this.poRepo = poRepo;
        this.itemRepo = itemRepo;
        this.eventBus = eventBus;
    }
    async createSupplier(dto) {
        const s = this.supplierRepo.create(dto);
        return this.supplierRepo.save(s);
    }
    async getSupplier(id) {
        const s = await this.supplierRepo.findOne({ where: { id } });
        if (!s)
            throw new NotFoundException('supplier not found');
        return s;
    }
    async createPurchaseOrder(dto, actorId) {
        const supplier = await this.supplierRepo.findOne({ where: { id: dto.supplierId } });
        if (!supplier)
            throw new NotFoundException('supplier not found');
        const items = dto.items.map((it) => ({ description: it.description, quantity: it.quantity, unitPrice: it.unitPrice, totalPrice: Number(it.quantity) * Number(it.unitPrice) }));
        const total = items.reduce((sum, it) => sum + Number(it.totalPrice), 0);
        const po = this.poRepo.create({ supplier, createdBy: actorId, totalAmount: total, currency: dto.currency || 'USD', status: 'PENDING', items });
        const saved = await this.poRepo.save(po);
        // publish event
        const ev = { purchaseOrderId: saved.id, supplierId: supplier.id, totalAmount: Number(saved.totalAmount) };
        this.eventBus.publish('PurchaseOrderCreated', ev);
        return saved;
    }
    async approvePurchaseOrder(poId, dto, approverId) {
        const po = await this.poRepo.findOne({ where: { id: poId }, relations: ['supplier', 'items'] });
        if (!po)
            throw new NotFoundException('purchase order not found');
        if (po.status !== 'PENDING')
            throw new BadRequestException('purchase order not in pending state');
        po.status = 'APPROVED';
        po.approvedBy = approverId;
        po.approvedAt = new Date();
        const saved = await this.poRepo.save(po);
        return saved;
    }
    async listPurchaseOrders(filter) {
        const qb = this.poRepo.createQueryBuilder('p').leftJoinAndSelect('p.supplier', 's').leftJoinAndSelect('p.items', 'i');
        if (filter?.status)
            qb.where('p.status = :s', { s: filter.status });
        if (filter?.supplierId)
            qb.andWhere('p.supplier_id = :id', { id: filter.supplierId });
        qb.orderBy('p.created_at', 'DESC');
        return qb.getMany();
    }
};
ProcurementService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Supplier)),
    __param(1, InjectRepository(PurchaseOrder)),
    __param(2, InjectRepository(PurchaseOrderItem)),
    __metadata("design:paramtypes", [Repository,
        Repository,
        Repository,
        EventBusService])
], ProcurementService);
export { ProcurementService };
//# sourceMappingURL=procurement.service.js.map