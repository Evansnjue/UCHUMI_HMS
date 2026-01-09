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
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { InventoryItem } from './inventory-item.entity';
import { Department } from './department.entity';
import { User } from '../auth/entities/user.entity';
let StockMovement = class StockMovement {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], StockMovement.prototype, "id", void 0);
__decorate([
    ManyToOne(() => InventoryItem, { nullable: false, onDelete: 'CASCADE' }),
    __metadata("design:type", InventoryItem)
], StockMovement.prototype, "item", void 0);
__decorate([
    ManyToOne(() => Department, { nullable: true, onDelete: 'SET NULL' }),
    __metadata("design:type", Department)
], StockMovement.prototype, "fromDepartment", void 0);
__decorate([
    ManyToOne(() => Department, { nullable: true, onDelete: 'SET NULL' }),
    __metadata("design:type", Department)
], StockMovement.prototype, "toDepartment", void 0);
__decorate([
    Column({ type: 'numeric' }),
    __metadata("design:type", Number)
], StockMovement.prototype, "delta", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], StockMovement.prototype, "reason", void 0);
__decorate([
    Column({ type: 'text' }),
    __metadata("design:type", String)
], StockMovement.prototype, "type", void 0);
__decorate([
    ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' }),
    __metadata("design:type", typeof (_a = typeof User !== "undefined" && User) === "function" ? _a : Object)
], StockMovement.prototype, "createdBy", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], StockMovement.prototype, "createdAt", void 0);
StockMovement = __decorate([
    Entity({ name: 'stock_movements' })
], StockMovement);
export { StockMovement };
//# sourceMappingURL=stock-movement.entity.js.map