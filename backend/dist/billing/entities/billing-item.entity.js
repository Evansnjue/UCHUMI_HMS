var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Invoice } from './invoice.entity';
let BillingItem = class BillingItem {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], BillingItem.prototype, "id", void 0);
__decorate([
    ManyToOne(() => Invoice, (inv) => inv.items, { onDelete: 'CASCADE' }),
    __metadata("design:type", Invoice)
], BillingItem.prototype, "invoice", void 0);
__decorate([
    Column({ type: 'text' }),
    __metadata("design:type", String)
], BillingItem.prototype, "description", void 0);
__decorate([
    Column({ type: 'numeric', default: 1 }),
    __metadata("design:type", Number)
], BillingItem.prototype, "quantity", void 0);
__decorate([
    Column({ type: 'numeric', default: 0 }),
    __metadata("design:type", Number)
], BillingItem.prototype, "unitPrice", void 0);
__decorate([
    Column({ type: 'numeric', default: 0 }),
    __metadata("design:type", Number)
], BillingItem.prototype, "total", void 0);
BillingItem = __decorate([
    Entity({ name: 'billing_items' })
], BillingItem);
export { BillingItem };
//# sourceMappingURL=billing-item.entity.js.map