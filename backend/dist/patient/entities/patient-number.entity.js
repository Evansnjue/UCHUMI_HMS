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
import { Patient } from './patient.entity';
let PatientNumber = class PatientNumber {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], PatientNumber.prototype, "id", void 0);
__decorate([
    Column({ type: 'text' }),
    __metadata("design:type", String)
], PatientNumber.prototype, "type", void 0);
__decorate([
    Column({ type: 'text', unique: true }),
    __metadata("design:type", String)
], PatientNumber.prototype, "number", void 0);
__decorate([
    ManyToOne(() => Patient, (p) => p.numbers, { onDelete: 'CASCADE' }),
    __metadata("design:type", Patient)
], PatientNumber.prototype, "patient", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], PatientNumber.prototype, "assignedAt", void 0);
PatientNumber = __decorate([
    Entity({ name: 'patient_numbers' })
], PatientNumber);
export { PatientNumber };
//# sourceMappingURL=patient-number.entity.js.map