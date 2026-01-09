var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Patient } from '../patient/entities/patient.entity';
import { Department } from '../patient/entities/department.entity';
import { VisitStatus } from './visit-status.entity';
let Visit = class Visit {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Visit.prototype, "id", void 0);
__decorate([
    Column({ unique: true }),
    __metadata("design:type", String)
], Visit.prototype, "visitNumber", void 0);
__decorate([
    ManyToOne(() => Patient, { eager: true }),
    JoinColumn({ name: 'patient_id' }),
    __metadata("design:type", typeof (_a = typeof Patient !== "undefined" && Patient) === "function" ? _a : Object)
], Visit.prototype, "patient", void 0);
__decorate([
    ManyToOne(() => Department, { eager: true }),
    JoinColumn({ name: 'department_id' }),
    __metadata("design:type", typeof (_b = typeof Department !== "undefined" && Department) === "function" ? _b : Object)
], Visit.prototype, "department", void 0);
__decorate([
    ManyToOne(() => VisitStatus, { eager: true }),
    JoinColumn({ name: 'status_id' }),
    __metadata("design:type", VisitStatus)
], Visit.prototype, "status", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Visit.prototype, "notes", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Visit.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Visit.prototype, "updatedAt", void 0);
Visit = __decorate([
    Entity({ name: 'visits' })
], Visit);
export { Visit };
//# sourceMappingURL=visit.entity.js.map