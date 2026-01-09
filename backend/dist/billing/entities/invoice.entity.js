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
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { BillingItem } from './billing-item.entity';
import { Patient } from '../patient/entities/patient.entity';
let Invoice = class Invoice {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Invoice.prototype, "id", void 0);
__decorate([
    ManyToOne(() => Patient, { nullable: true, onDelete: 'SET NULL' }),
    __metadata("design:type", typeof (_a = typeof Patient !== "undefined" && Patient) === "function" ? _a : Object)
], Invoice.prototype, "patient", void 0);
__decorate([
    Column({ type: 'numeric', default: 0 }),
    __metadata("design:type", Number)
], Invoice.prototype, "totalAmount", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "insuranceProvider", void 0);
__decorate([
    Column({ type: 'numeric', default: 0 }),
    __metadata("design:type", Number)
], Invoice.prototype, "insuranceCoveredAmount", void 0);
__decorate([
    Column({ type: 'numeric', default: 0 }),
    __metadata("design:type", Number)
], Invoice.prototype, "patientResponsible", void 0);
__decorate([
    Column({ type: 'text', default: 'UNPAID' }),
    __metadata("design:type", String)
], Invoice.prototype, "status", void 0);
__decorate([
    OneToMany(() => BillingItem, (i) => i.invoice, { cascade: true, eager: true }),
    __metadata("design:type", Array)
], Invoice.prototype, "items", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Invoice.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Invoice.prototype, "updatedAt", void 0);
Invoice = __decorate([
    Entity({ name: 'invoices' })
], Invoice);
export { Invoice };
//# sourceMappingURL=invoice.entity.js.map