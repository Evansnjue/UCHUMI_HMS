var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, UpdateDateColumn } from 'typeorm';
import { Department } from './department.entity';
import { Drug } from '../clinical/entities/drug.entity';
/**
 * Inventory items represent tracked products in the central store.
 * - Batches & expiry dates are captured
 */
let InventoryItem = class InventoryItem {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], InventoryItem.prototype, "id", void 0);
__decorate([
    Column({ type: 'text' }),
    __metadata("design:type", String)
], InventoryItem.prototype, "name", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], InventoryItem.prototype, "sku", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], InventoryItem.prototype, "batch", void 0);
__decorate([
    Column({ type: 'date', nullable: true }),
    __metadata("design:type", String)
], InventoryItem.prototype, "expiryDate", void 0);
__decorate([
    Column({ type: 'numeric', default: 0 }),
    __metadata("design:type", Number)
], InventoryItem.prototype, "quantity", void 0);
__decorate([
    ManyToOne(() => Department, { nullable: true, onDelete: 'SET NULL' }),
    __metadata("design:type", Department)
], InventoryItem.prototype, "department", void 0);
__decorate([
    ManyToOne(() => Drug, { nullable: true, onDelete: 'SET NULL' }),
    __metadata("design:type", typeof (_a = typeof Drug !== "undefined" && Drug) === "function" ? _a : Object)
], InventoryItem.prototype, "drug", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], InventoryItem.prototype, "productType", void 0);
__decorate([
    UpdateDateColumn({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], InventoryItem.prototype, "updatedAt", void 0);
InventoryItem = __decorate([
    Entity({ name: 'inventory_items' })
], InventoryItem);
export { InventoryItem };
//# sourceMappingURL=inventory-item.entity.js.map