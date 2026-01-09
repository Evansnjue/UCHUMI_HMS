var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';
let Attendance = class Attendance {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Attendance.prototype, "id", void 0);
__decorate([
    ManyToOne(() => Employee, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'employee_id' }),
    __metadata("design:type", Employee)
], Attendance.prototype, "employee", void 0);
__decorate([
    Column({ name: 'check_in', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Attendance.prototype, "checkIn", void 0);
__decorate([
    Column({ name: 'check_out', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Attendance.prototype, "checkOut", void 0);
__decorate([
    Column({ name: 'shift_date', type: 'date' }),
    __metadata("design:type", String)
], Attendance.prototype, "shiftDate", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Attendance.prototype, "status", void 0);
__decorate([
    Column({ name: 'overtime_seconds', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Attendance.prototype, "overtimeSeconds", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' }),
    __metadata("design:type", Date)
], Attendance.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Attendance.prototype, "updatedAt", void 0);
Attendance = __decorate([
    Entity({ name: 'hr_attendance' })
], Attendance);
export { Attendance };
//# sourceMappingURL=attendance.entity.js.map