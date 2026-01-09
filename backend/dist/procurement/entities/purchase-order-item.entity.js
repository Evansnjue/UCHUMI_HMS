var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
let PurchaseOrderItem = class PurchaseOrderItem {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], PurchaseOrderItem.prototype, "id", void 0);
__decorate([
    ManyToOne(() => PurchaseOrder, (po) => po.items, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'purchase_order_id' }),
    __metadata("design:type", PurchaseOrder)
], PurchaseOrderItem.prototype, "purchaseOrder", void 0);
__decorate([
    Column({ type: 'text' }),
    __metadata("design:type", String)
], PurchaseOrderItem.prototype, "description", void 0);
__decorate([
    Column({ type: 'int' }),
    __metadata("design:type", Number)
], PurchaseOrderItem.prototype, "quantity", void 0);
__decorate([
    Column({ type: 'numeric', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], PurchaseOrderItem.prototype, "unitPrice", void 0);
__decorate([
    Column({ type: 'numeric', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], PurchaseOrderItem.prototype, "totalPrice", void 0);
PurchaseOrderItem = __decorate([
    Entity({ name: 'procurement_purchase_order_items' })
], PurchaseOrderItem);
export { PurchaseOrderItem };
//# sourceMappingURL=purchase-order-item.entity.js.map