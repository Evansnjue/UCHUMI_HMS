var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { Attendance } from './entities/attendance.entity';
import { Payroll } from './entities/payroll.entity';
import { EventBusService } from '../auth/event-bus.service';
let HRService = class HRService {
    constructor(empRepo, attRepo, payrollRepo, eventBus) {
        this.empRepo = empRepo;
        this.attRepo = attRepo;
        this.payrollRepo = payrollRepo;
        this.eventBus = eventBus;
        this.employeeSequence = 0; // simple in-memory fallback for employee numbers; prefer DB sequence in prod
    }
    async allocateEmployeeNumber() {
        // production: use a sequence table or DB sequence; here we do a safe attempt
        const count = await this.empRepo.count();
        const next = count + 1;
        const year = new Date().getFullYear();
        return `EMP-${year}-${String(next).padStart(5, '0')}`;
    }
    async createEmployee(dto, actorId) {
        const existing = await this.empRepo.findOne({ where: { email: dto.email } });
        if (existing)
            throw new BadRequestException('email already exists');
        const employeeNo = await this.allocateEmployeeNumber();
        const emp = this.empRepo.create({ ...dto, employeeNo });
        const saved = await this.empRepo.save(emp);
        return saved;
    }
    async getEmployee(id) {
        const e = await this.empRepo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('employee not found');
        return e;
    }
    async checkIn(dto) {
        const emp = await this.empRepo.findOne({ where: { id: dto.employeeId } });
        if (!emp)
            throw new NotFoundException('employee not found');
        const ts = dto.timestamp ? new Date(dto.timestamp) : new Date();
        const shiftDate = ts.toISOString().substring(0, 10);
        // Simple late rule: shiftStart 09:00, grace 15 minutes
        const shiftStart = new Date(shiftDate + 'T09:00:00Z');
        const late = ts.getTime() > (shiftStart.getTime() + 15 * 60 * 1000);
        const status = late ? 'LATE' : 'PRESENT';
        const attendance = this.attRepo.create({ employee: emp, checkIn: ts, shiftDate, status });
        const saved = await this.attRepo.save(attendance);
        const payload = { employeeId: emp.id, attendanceId: saved.id, checkIn: ts.toISOString(), shiftDate, status };
        this.eventBus.publish('EmployeeCheckedIn', payload);
        return saved;
    }
    async checkOut(dto) {
        const emp = await this.empRepo.findOne({ where: { id: dto.employeeId } });
        if (!emp)
            throw new NotFoundException('employee not found');
        const ts = dto.timestamp ? new Date(dto.timestamp) : new Date();
        const shiftDate = ts.toISOString().substring(0, 10);
        const att = await this.attRepo.findOne({ where: { shiftDate, employee: { id: emp.id } } });
        if (!att)
            throw new NotFoundException('attendance record not found');
        att.checkOut = ts;
        // compute overtime: if worked more than 8 hours (28800 seconds)
        const workedSeconds = Math.floor((att.checkOut.getTime() - att.checkIn.getTime()) / 1000);
        const overtime = Math.max(0, workedSeconds - 8 * 3600);
        att.overtimeSeconds = overtime;
        if (overtime > 0)
            att.status = 'OVERTIME';
        const saved = await this.attRepo.save(att);
        if (overtime > 0) {
            const ev = { employeeId: emp.id, attendanceId: att.id, overtimeSeconds: overtime, date: shiftDate };
            this.eventBus.publish('EmployeeOvertime', ev);
        }
        return saved;
    }
    async unpaidOvertimeReport(start, end) {
        // Example report: list attendances with overtime > 0 in date range
        const rows = await this.attRepo.createQueryBuilder('a')
            .leftJoinAndSelect('a.employee', 'e')
            .where('a.shift_date >= :start AND a.shift_date <= :end', { start, end })
            .andWhere('a.overtime_seconds > 0')
            .getMany();
        return rows;
    }
    async generatePayroll(dto) {
        const { periodStart, periodEnd, employeeId } = dto;
        const qb = this.empRepo.createQueryBuilder('e');
        if (employeeId)
            qb.andWhere('e.id = :id', { id: employeeId });
        const emps = await qb.getMany();
        const created = [];
        for (const e of emps) {
            // simple gross pay: monthly salary prorated for month (if monthly period) + overtime pay
            // For demo: use salary + sum overtime seconds * (salary/ (22*8*3600)) as hourly equivalent
            const overtimeRows = await this.attRepo.createQueryBuilder('a')
                .select('SUM(a.overtime_seconds)', 'totalOvertime')
                .where('a.employee_id = :id', { id: e.id })
                .andWhere('a.shift_date >= :start AND a.shift_date <= :end', { start: periodStart, end: periodEnd })
                .getRawOne();
            const overtimeSeconds = Number(overtimeRows?.totalOvertime || 0);
            const hourlyRate = Number(e.salary) / (22 * 8); // assumption: 22 working days
            const overtimePay = (overtimeSeconds / 3600) * hourlyRate * 1.5; // 1.5x
            const gross = Number(e.salary) + overtimePay;
            const deductions = 0; // TODO: hooks for tax/benefits
            const net = gross - deductions;
            const rec = this.payrollRepo.create({ employee: e, periodStart, periodEnd, grossPay: gross, deductions, netPay: net });
            const saved = await this.payrollRepo.save(rec);
            const ev = { payrollId: saved.id, employeeId: e.id, periodStart, periodEnd, netPay: Number(saved.netPay) };
            this.eventBus.publish('PayrollProcessed', ev);
            created.push(saved);
        }
        return created;
    }
};
HRService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Employee)),
    __param(1, InjectRepository(Attendance)),
    __param(2, InjectRepository(Payroll)),
    __metadata("design:paramtypes", [Repository,
        Repository,
        Repository,
        EventBusService])
], HRService);
export { HRService };
//# sourceMappingURL=hr.service.js.map