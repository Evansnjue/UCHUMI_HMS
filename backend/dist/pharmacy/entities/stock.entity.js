var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, UpdateDateColumn } from 'typeorm';
import { Drug } from '../../clinical/entities/drug.entity';
/**
 * Stock entity tracks the central inventory for drugs.
 * - Use 'location' to support multi-store inventories (central, satellite)
 */
let Stock = class Stock {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Stock.prototype, "id", void 0);
__decorate([
    ManyToOne(() => Drug, { nullable: false, onDelete: 'CASCADE' }),
    __metadata("design:type", Drug)
], Stock.prototype, "drug", void 0);
__decorate([
    Column({ type: 'text', default: 'central' }),
    __metadata("design:type", String)
], Stock.prototype, "location", void 0);
__decorate([
    Column({ type: 'numeric', default: 0 }),
    __metadata("design:type", Number)
], Stock.prototype, "quantity", void 0);
__decorate([
    UpdateDateColumn({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Stock.prototype, "updatedAt", void 0);
Stock = __decorate([
    Entity({ name: 'stock' }),
    Index(['drug', 'location'], { unique: true })
], Stock);
export { Stock };
//# sourceMappingURL=stock.entity.js.map