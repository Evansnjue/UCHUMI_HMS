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
var InventoryService_1;
import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { Department } from './entities/department.entity';
import { EventBusService } from '../auth/event-bus.service';
let InventoryService = InventoryService_1 = class InventoryService {
    constructor(itemsRepo, movementRepo, deptRepo, eventBus) {
        this.itemsRepo = itemsRepo;
        this.movementRepo = movementRepo;
        this.deptRepo = deptRepo;
        this.eventBus = eventBus;
        this.logger = new Logger(InventoryService_1.name);
        this.lowStockThreshold = 5; // configurable in the future
    }
    async listItems(limit = 100, offset = 0) {
        return this.itemsRepo.find({ relations: ['department', 'drug'], take: limit, skip: offset });
    }
    async getItem(id) {
        const it = await this.itemsRepo.findOne({ where: { id }, relations: ['department', 'drug'] });
        if (!it)
            throw new NotFoundException('Inventory item not found');
        return it;
    }
    async addStock(itemId, quantity, reason, performedBy) {
        if (quantity <= 0)
            throw new BadRequestException('Quantity must be positive');
        return await getManager().transaction(async (manager) => {
            const item = await manager.findOne(InventoryItem, { where: { id: itemId }, relations: ['department'] });
            if (!item)
                throw new NotFoundException('Item not found');
            const oldQty = Number(item.quantity);
            item.quantity = Number(oldQty) + Number(quantity);
            await manager.save(item);
            const movement = manager.create(StockMovement, { item: item, toDepartment: item.department, delta: Number(quantity), reason, type: 'ADD', createdBy: { id: performedBy } });
            await manager.save(movement);
            const evt = { itemId: item.id, departmentId: item.department?.id, oldQuantity: oldQty, newQuantity: Number(item.quantity), updatedAt: new Date().toISOString() };
            this.eventBus.publish('StockUpdated', evt);
            // if low stock threshold crossed upward, nothing to do; if new qty <= threshold, emit low alert
            if (Number(item.quantity) <= this.lowStockThreshold) {
                const alert = { itemId: item.id, departmentId: item.department?.id, quantity: Number(item.quantity), threshold: this.lowStockThreshold, detectedAt: new Date().toISOString() };
                this.eventBus.publish('StockLowAlert', alert);
            }
            await manager.query(`INSERT INTO pharmacy_audit(event_type, payload) VALUES ($1,$2)`, ['InventoryAdd', JSON.stringify({ itemId, quantity, reason, performedBy })]);
            return item;
        });
    }
    async removeStock(itemId, quantity, reason, performedBy) {
        if (quantity <= 0)
            throw new BadRequestException('Quantity must be positive');
        return await getManager().transaction(async (manager) => {
            const item = await manager.findOne(InventoryItem, { where: { id: itemId }, relations: ['department'] });
            if (!item)
                throw new NotFoundException('Item not found');
            const oldQty = Number(item.quantity);
            if (oldQty < Number(quantity))
                throw new BadRequestException('Insufficient quantity');
            item.quantity = oldQty - Number(quantity);
            await manager.save(item);
            const movement = manager.create(StockMovement, { item: item, fromDepartment: item.department, delta: -Number(quantity), reason, type: 'REMOVE', createdBy: { id: performedBy } });
            await manager.save(movement);
            const evt = { itemId: item.id, departmentId: item.department?.id, oldQuantity: oldQty, newQuantity: Number(item.quantity), updatedAt: new Date().toISOString() };
            this.eventBus.publish('StockUpdated', evt);
            if (Number(item.quantity) <= this.lowStockThreshold) {
                const alert = { itemId: item.id, departmentId: item.department?.id, quantity: Number(item.quantity), threshold: this.lowStockThreshold, detectedAt: new Date().toISOString() };
                this.eventBus.publish('StockLowAlert', alert);
            }
            await manager.query(`INSERT INTO pharmacy_audit(event_type, payload) VALUES ($1,$2)`, ['InventoryRemove', JSON.stringify({ itemId, quantity, reason, performedBy })]);
            return item;
        });
    }
    async transferStock(itemId, toDepartmentId, quantity, reason, performedBy) {
        if (quantity <= 0)
            throw new BadRequestException('Quantity must be positive');
        return await getManager().transaction(async (manager) => {
            const item = await manager.findOne(InventoryItem, { where: { id: itemId }, relations: ['department'] });
            if (!item)
                throw new NotFoundException('Item not found');
            const toDept = await manager.findOne(Department, { where: { id: toDepartmentId } });
            if (!toDept)
                throw new NotFoundException('Destination department not found');
            const oldQty = Number(item.quantity);
            if (oldQty < Number(quantity))
                throw new BadRequestException('Insufficient quantity');
            // decrement from current
            item.quantity = oldQty - Number(quantity);
            await manager.save(item);
            // create movement
            const movement = manager.create(StockMovement, { item: item, fromDepartment: item.department, toDepartment: toDept, delta: -Number(quantity), reason, type: 'TRANSFER', createdBy: { id: performedBy } });
            await manager.save(movement);
            // Create or adjust a destination inventory item record (by batch/sku we may want to find existing); for simplicity, clone the item into toDept
            const destItem = await manager.findOne(InventoryItem, { where: { name: item.name, batch: item.batch, department: { id: toDept.id } } });
            if (destItem) {
                destItem.quantity = Number(destItem.quantity) + Number(quantity);
                await manager.save(destItem);
            }
            else {
                const newItem = manager.create(InventoryItem, { name: item.name, sku: item.sku, batch: item.batch, expiryDate: item.expiryDate, quantity: Number(quantity), department: toDept, productType: item.productType });
                await manager.save(newItem);
            }
            const evt = { itemId: item.id, departmentId: item.department?.id, oldQuantity: oldQty, newQuantity: Number(item.quantity), updatedAt: new Date().toISOString() };
            this.eventBus.publish('StockUpdated', evt);
            if (Number(item.quantity) <= this.lowStockThreshold) {
                this.eventBus.publish('StockLowAlert', { itemId: item.id, departmentId: item.department?.id, quantity: Number(item.quantity), threshold: this.lowStockThreshold, detectedAt: new Date().toISOString() });
            }
            await manager.query(`INSERT INTO pharmacy_audit(event_type, payload) VALUES ($1,$2)`, ['InventoryTransfer', JSON.stringify({ itemId, toDepartmentId, quantity, reason, performedBy })]);
            return { source: item };
        });
    }
    async listLowStock(threshold = this.lowStockThreshold) {
        return this.itemsRepo.createQueryBuilder('i').leftJoinAndSelect('i.department', 'd').where('i.quantity <= :th', { th: threshold }).getMany();
    }
};
InventoryService = InventoryService_1 = __decorate([
    Injectable(),
    __param(0, InjectRepository(InventoryItem)),
    __param(1, InjectRepository(StockMovement)),
    __param(2, InjectRepository(Department)),
    __metadata("design:paramtypes", [Repository,
        Repository,
        Repository,
        EventBusService])
], InventoryService);
export { InventoryService };
//# sourceMappingURL=inventory.service.js.map