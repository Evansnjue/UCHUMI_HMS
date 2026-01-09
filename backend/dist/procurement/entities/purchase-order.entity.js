var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Supplier } from './supplier.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';
let PurchaseOrder = class PurchaseOrder {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "id", void 0);
__decorate([
    ManyToOne(() => Supplier, { onDelete: 'RESTRICT' }),
    JoinColumn({ name: 'supplier_id' }),
    __metadata("design:type", Supplier)
], PurchaseOrder.prototype, "supplier", void 0);
__decorate([
    Column({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "createdBy", void 0);
__decorate([
    Column({ name: 'total_amount', type: 'numeric', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "totalAmount", void 0);
__decorate([
    Column({ default: 'USD' }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "currency", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "status", void 0);
__decorate([
    Column({ name: 'approved_by', nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "approvedBy", void 0);
__decorate([
    Column({ name: 'approved_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], PurchaseOrder.prototype, "approvedAt", void 0);
__decorate([
    OneToMany(() => PurchaseOrderItem, (i) => i.purchaseOrder, { cascade: true }),
    __metadata("design:type", Array)
], PurchaseOrder.prototype, "items", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' }),
    __metadata("design:type", Date)
], PurchaseOrder.prototype, "createdAt", void 0);
PurchaseOrder = __decorate([
    Entity({ name: 'procurement_purchase_orders' })
], PurchaseOrder);
export { PurchaseOrder };
//# sourceMappingURL=purchase-order.entity.js.map