import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { Department } from './entities/department.entity';
import { EventBusService } from '../auth/event-bus.service';
import { StockUpdatedEvent, StockLowAlertEvent } from './events/inventory.events';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);
  private lowStockThreshold = 5; // configurable in the future

  constructor(
    @InjectRepository(InventoryItem) private itemsRepo: Repository<InventoryItem>,
    @InjectRepository(StockMovement) private movementRepo: Repository<StockMovement>,
    @InjectRepository(Department) private deptRepo: Repository<Department>,
    private eventBus: EventBusService,
  ) {}

  async listItems(limit = 100, offset = 0) {
    return this.itemsRepo.find({ relations: ['department', 'drug'], take: limit, skip: offset });
  }

  async getItem(id: string) {
    const it = await this.itemsRepo.findOne({ where: { id }, relations: ['department', 'drug'] });
    if (!it) throw new NotFoundException('Inventory item not found');
    return it;
  }

  async addStock(itemId: string, quantity: number, reason: string, performedBy: string) {
    if (quantity <= 0) throw new BadRequestException('Quantity must be positive');
    return await getManager().transaction(async (manager) => {
      const item = await manager.findOne(InventoryItem, { where: { id: itemId }, relations: ['department'] });
      if (!item) throw new NotFoundException('Item not found');

      const oldQty = Number(item.quantity);
      item.quantity = Number(oldQty) + Number(quantity);
      await manager.save(item);

      const movement = manager.create(StockMovement, { item: item, toDepartment: item.department, delta: Number(quantity), reason, type: 'ADD', createdBy: { id: performedBy } } as any);
      await manager.save(movement);

      const evt: StockUpdatedEvent = { itemId: item.id, departmentId: item.department?.id, oldQuantity: oldQty, newQuantity: Number(item.quantity), updatedAt: new Date().toISOString() };
      this.eventBus.publish('StockUpdated', evt);

      // if low stock threshold crossed upward, nothing to do; if new qty <= threshold, emit low alert
      if (Number(item.quantity) <= this.lowStockThreshold) {
        const alert: StockLowAlertEvent = { itemId: item.id, departmentId: item.department?.id, quantity: Number(item.quantity), threshold: this.lowStockThreshold, detectedAt: new Date().toISOString() };
        this.eventBus.publish('StockLowAlert', alert);
      }

      await manager.query(`INSERT INTO pharmacy_audit(event_type, payload) VALUES ($1,$2)`, ['InventoryAdd', JSON.stringify({ itemId, quantity, reason, performedBy })]);

      return item;
    });
  }

  async removeStock(itemId: string, quantity: number, reason: string, performedBy: string) {
    if (quantity <= 0) throw new BadRequestException('Quantity must be positive');
    return await getManager().transaction(async (manager) => {
      const item = await manager.findOne(InventoryItem, { where: { id: itemId }, relations: ['department'] });
      if (!item) throw new NotFoundException('Item not found');
      const oldQty = Number(item.quantity);
      if (oldQty < Number(quantity)) throw new BadRequestException('Insufficient quantity');
      item.quantity = oldQty - Number(quantity);
      await manager.save(item);

      const movement = manager.create(StockMovement, { item: item, fromDepartment: item.department, delta: -Number(quantity), reason, type: 'REMOVE', createdBy: { id: performedBy } } as any);
      await manager.save(movement);

      const evt: StockUpdatedEvent = { itemId: item.id, departmentId: item.department?.id, oldQuantity: oldQty, newQuantity: Number(item.quantity), updatedAt: new Date().toISOString() };
      this.eventBus.publish('StockUpdated', evt);

      if (Number(item.quantity) <= this.lowStockThreshold) {
        const alert: StockLowAlertEvent = { itemId: item.id, departmentId: item.department?.id, quantity: Number(item.quantity), threshold: this.lowStockThreshold, detectedAt: new Date().toISOString() };
        this.eventBus.publish('StockLowAlert', alert);
      }

      await manager.query(`INSERT INTO pharmacy_audit(event_type, payload) VALUES ($1,$2)`, ['InventoryRemove', JSON.stringify({ itemId, quantity, reason, performedBy })]);
      return item;
    });
  }

  async transferStock(itemId: string, toDepartmentId: string, quantity: number, reason: string, performedBy: string) {
    if (quantity <= 0) throw new BadRequestException('Quantity must be positive');
    return await getManager().transaction(async (manager) => {
      const item = await manager.findOne(InventoryItem, { where: { id: itemId }, relations: ['department'] });
      if (!item) throw new NotFoundException('Item not found');
      const toDept = await manager.findOne(Department, { where: { id: toDepartmentId } });
      if (!toDept) throw new NotFoundException('Destination department not found');
      const oldQty = Number(item.quantity);
      if (oldQty < Number(quantity)) throw new BadRequestException('Insufficient quantity');

      // decrement from current
      item.quantity = oldQty - Number(quantity);
      await manager.save(item);

      // create movement
      const movement = manager.create(StockMovement, { item: item, fromDepartment: item.department, toDepartment: toDept, delta: -Number(quantity), reason, type: 'TRANSFER', createdBy: { id: performedBy } } as any);
      await manager.save(movement);

      // Create or adjust a destination inventory item record (by batch/sku we may want to find existing); for simplicity, clone the item into toDept
      const destItem = await manager.findOne(InventoryItem, { where: { name: item.name, batch: item.batch, department: { id: toDept.id } } });
      if (destItem) {
        destItem.quantity = Number(destItem.quantity) + Number(quantity);
        await manager.save(destItem);
      } else {
        const newItem = manager.create(InventoryItem, { name: item.name, sku: item.sku, batch: item.batch, expiryDate: item.expiryDate, quantity: Number(quantity), department: toDept, productType: item.productType } as any);
        await manager.save(newItem);
      }

      const evt: StockUpdatedEvent = { itemId: item.id, departmentId: item.department?.id, oldQuantity: oldQty, newQuantity: Number(item.quantity), updatedAt: new Date().toISOString() };
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
}
