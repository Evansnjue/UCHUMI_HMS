var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { Employee } from './employee.entity';
import { ManyToOne, JoinColumn } from 'typeorm';
let Payroll = class Payroll {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Payroll.prototype, "id", void 0);
__decorate([
    ManyToOne(() => Employee, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'employee_id' }),
    __metadata("design:type", Employee)
], Payroll.prototype, "employee", void 0);
__decorate([
    Column({ name: 'period_start', type: 'date' }),
    __metadata("design:type", String)
], Payroll.prototype, "periodStart", void 0);
__decorate([
    Column({ name: 'period_end', type: 'date' }),
    __metadata("design:type", String)
], Payroll.prototype, "periodEnd", void 0);
__decorate([
    Column({ name: 'gross_pay', type: 'numeric', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], Payroll.prototype, "grossPay", void 0);
__decorate([
    Column({ type: 'numeric', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Payroll.prototype, "deductions", void 0);
__decorate([
    Column({ name: 'net_pay', type: 'numeric', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], Payroll.prototype, "netPay", void 0);
__decorate([
    Column({ default: false }),
    __metadata("design:type", Boolean)
], Payroll.prototype, "processed", void 0);
__decorate([
    Column({ name: 'processed_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Payroll.prototype, "processedAt", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' }),
    __metadata("design:type", Date)
], Payroll.prototype, "createdAt", void 0);
Payroll = __decorate([
    Entity({ name: 'hr_payroll' })
], Payroll);
export { Payroll };
//# sourceMappingURL=payroll.entity.js.map