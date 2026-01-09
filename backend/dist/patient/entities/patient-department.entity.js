var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { Patient } from './patient.entity';
import { Department } from './department.entity';
let PatientDepartment = class PatientDepartment {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], PatientDepartment.prototype, "id", void 0);
__decorate([
    ManyToOne(() => Patient, (p) => p.departments, { onDelete: 'CASCADE' }),
    __metadata("design:type", Patient)
], PatientDepartment.prototype, "patient", void 0);
__decorate([
    ManyToOne(() => Department, (d) => d.patientAssignments, { eager: true, onDelete: 'CASCADE' }),
    __metadata("design:type", Department)
], PatientDepartment.prototype, "department", void 0);
__decorate([
    Column({ default: true }),
    __metadata("design:type", Boolean)
], PatientDepartment.prototype, "active", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], PatientDepartment.prototype, "assignedAt", void 0);
PatientDepartment = __decorate([
    Entity({ name: 'patient_departments' })
], PatientDepartment);
export { PatientDepartment };
//# sourceMappingURL=patient-department.entity.js.map