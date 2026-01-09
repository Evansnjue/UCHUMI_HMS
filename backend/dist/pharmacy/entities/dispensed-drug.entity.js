var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { PrescriptionItem } from '../../clinical/entities/prescription-item.entity';
import { Prescription } from '../../clinical/entities/prescription.entity';
import { Drug } from '../../clinical/entities/drug.entity';
import { User } from '../../auth/entities/user.entity';
/**
 * Records actual dispenses performed by pharmacists. Each row references the
 * prescription item and the pharmacist who dispensed it.
 */
let DispensedDrug = class DispensedDrug {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], DispensedDrug.prototype, "id", void 0);
__decorate([
    ManyToOne(() => PrescriptionItem, { nullable: false, onDelete: 'CASCADE' }),
    __metadata("design:type", PrescriptionItem)
], DispensedDrug.prototype, "prescriptionItem", void 0);
__decorate([
    ManyToOne(() => Prescription, { nullable: false, onDelete: 'CASCADE' }),
    __metadata("design:type", Prescription)
], DispensedDrug.prototype, "prescription", void 0);
__decorate([
    ManyToOne(() => Drug, { nullable: false, onDelete: 'CASCADE' }),
    __metadata("design:type", Drug)
], DispensedDrug.prototype, "drug", void 0);
__decorate([
    ManyToOne(() => User, { nullable: false, onDelete: 'SET NULL' }),
    __metadata("design:type", User)
], DispensedDrug.prototype, "pharmacist", void 0);
__decorate([
    Column({ type: 'numeric' }),
    __metadata("design:type", Number)
], DispensedDrug.prototype, "quantity", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], DispensedDrug.prototype, "unit", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], DispensedDrug.prototype, "dispensedAt", void 0);
DispensedDrug = __decorate([
    Entity({ name: 'dispensed_drugs' })
], DispensedDrug);
export { DispensedDrug };
//# sourceMappingURL=dispensed-drug.entity.js.map