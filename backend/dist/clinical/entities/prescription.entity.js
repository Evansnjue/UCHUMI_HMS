var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { Consultation } from './consultation.entity';
import { PrescriptionItem } from './prescription-item.entity';
import { User } from '../../auth/entities/user.entity';
let Prescription = class Prescription {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Prescription.prototype, "id", void 0);
__decorate([
    ManyToOne(() => Consultation, { eager: true }),
    __metadata("design:type", Consultation)
], Prescription.prototype, "consultation", void 0);
__decorate([
    ManyToOne(() => User, { eager: true }),
    __metadata("design:type", User)
], Prescription.prototype, "prescribedBy", void 0);
__decorate([
    OneToMany(() => PrescriptionItem, (i) => i.prescription, { cascade: true, eager: true }),
    __metadata("design:type", Array)
], Prescription.prototype, "items", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Prescription.prototype, "createdAt", void 0);
Prescription = __decorate([
    Entity({ name: 'prescriptions' })
], Prescription);
export { Prescription };
//# sourceMappingURL=prescription.entity.js.map