var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Prescription } from './prescription.entity';
import { Drug } from './drug.entity';
let PrescriptionItem = class PrescriptionItem {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], PrescriptionItem.prototype, "id", void 0);
__decorate([
    ManyToOne(() => Prescription, (p) => p.items, { onDelete: 'CASCADE' }),
    __metadata("design:type", Prescription)
], PrescriptionItem.prototype, "prescription", void 0);
__decorate([
    ManyToOne(() => Drug, { eager: true }),
    __metadata("design:type", Drug)
], PrescriptionItem.prototype, "drug", void 0);
__decorate([
    Column({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], PrescriptionItem.prototype, "quantity", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PrescriptionItem.prototype, "instructions", void 0);
PrescriptionItem = __decorate([
    Entity({ name: 'prescription_items' })
], PrescriptionItem);
export { PrescriptionItem };
//# sourceMappingURL=prescription-item.entity.js.map