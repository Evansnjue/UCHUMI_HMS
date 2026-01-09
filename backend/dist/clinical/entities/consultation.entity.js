var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Patient } from '../../patient/entities/patient.entity';
import { User } from '../../auth/entities/user.entity';
let Consultation = class Consultation {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Consultation.prototype, "id", void 0);
__decorate([
    ManyToOne(() => Patient, { eager: true }),
    __metadata("design:type", Patient)
], Consultation.prototype, "patient", void 0);
__decorate([
    ManyToOne(() => User, { eager: true }),
    __metadata("design:type", User)
], Consultation.prototype, "doctor", void 0);
__decorate([
    Column({ type: 'text' }),
    __metadata("design:type", String)
], Consultation.prototype, "diagnosis", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Consultation.prototype, "notes", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Consultation.prototype, "createdAt", void 0);
Consultation = __decorate([
    Entity({ name: 'consultations' })
], Consultation);
export { Consultation };
//# sourceMappingURL=consultation.entity.js.map