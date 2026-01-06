import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { Attendance } from './entities/attendance.entity';
import { Payroll } from './entities/payroll.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CheckInDto, CheckOutDto } from './dto/checkin.dto';
import { GeneratePayrollDto } from './dto/payroll.dto';
import { EventBusService } from '../auth/event-bus.service';
import { EmployeeCheckedInEvent, EmployeeOvertimeEvent, PayrollProcessedEvent } from './hr.events';

@Injectable()
export class HRService {
  private employeeSequence = 0; // simple in-memory fallback for employee numbers; prefer DB sequence in prod

  constructor(
    @InjectRepository(Employee) private empRepo: Repository<Employee>,
    @InjectRepository(Attendance) private attRepo: Repository<Attendance>,
    @InjectRepository(Payroll) private payrollRepo: Repository<Payroll>,
    private eventBus: EventBusService,
  ) {}

  private async allocateEmployeeNumber(): Promise<string> {
    // production: use a sequence table or DB sequence; here we do a safe attempt
    const count = await this.empRepo.count();
    const next = count + 1;
    const year = new Date().getFullYear();
    return `EMP-${year}-${String(next).padStart(5, '0')}`;
  }

  async createEmployee(dto: CreateEmployeeDto, actorId?: string) {
    const existing = await this.empRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('email already exists');

    const employeeNo = await this.allocateEmployeeNumber();
    const emp = this.empRepo.create({ ...dto, employeeNo });
    const saved = await this.empRepo.save(emp);
    return saved;
  }

  async getEmployee(id: string) {
    const e = await this.empRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('employee not found');
    return e;
  }

  async checkIn(dto: CheckInDto) {
    const emp = await this.empRepo.findOne({ where: { id: dto.employeeId } });
    if (!emp) throw new NotFoundException('employee not found');

    const ts = dto.timestamp ? new Date(dto.timestamp) : new Date();
    const shiftDate = ts.toISOString().substring(0, 10);

    // Simple late rule: shiftStart 09:00, grace 15 minutes
    const shiftStart = new Date(shiftDate + 'T09:00:00Z');
    const late = ts.getTime() > (shiftStart.getTime() + 15 * 60 * 1000);
    const status = late ? 'LATE' : 'PRESENT';

    const attendance = this.attRepo.create({ employee: emp, checkIn: ts, shiftDate, status });
    const saved = await this.attRepo.save(attendance);

    const payload: EmployeeCheckedInEvent = { employeeId: emp.id, attendanceId: saved.id, checkIn: ts.toISOString(), shiftDate, status };
    this.eventBus.publish('EmployeeCheckedIn', payload);
    return saved;
  }

  async checkOut(dto: CheckOutDto) {
    const emp = await this.empRepo.findOne({ where: { id: dto.employeeId } });
    if (!emp) throw new NotFoundException('employee not found');

    const ts = dto.timestamp ? new Date(dto.timestamp) : new Date();
    const shiftDate = ts.toISOString().substring(0, 10);

    const att = await this.attRepo.findOne({ where: { shiftDate, employee: { id: emp.id } } as any });
    if (!att) throw new NotFoundException('attendance record not found');

    att.checkOut = ts;

    // compute overtime: if worked more than 8 hours (28800 seconds)
    const workedSeconds = Math.floor((att.checkOut.getTime() - att.checkIn.getTime()) / 1000);
    const overtime = Math.max(0, workedSeconds - 8 * 3600);
    att.overtimeSeconds = overtime;
    if (overtime > 0) att.status = 'OVERTIME';

    const saved = await this.attRepo.save(att);

    if (overtime > 0) {
      const ev: EmployeeOvertimeEvent = { employeeId: emp.id, attendanceId: att.id, overtimeSeconds: overtime, date: shiftDate };
      this.eventBus.publish('EmployeeOvertime', ev);
    }

    return saved;
  }

  async unpaidOvertimeReport(start: string, end: string) {
    // Example report: list attendances with overtime > 0 in date range
    const rows = await this.attRepo.createQueryBuilder('a')
      .leftJoinAndSelect('a.employee', 'e')
      .where('a.shift_date >= :start AND a.shift_date <= :end', { start, end })
      .andWhere('a.overtime_seconds > 0')
      .getMany();
    return rows;
  }

  async generatePayroll(dto: GeneratePayrollDto) {
    const { periodStart, periodEnd, employeeId } = dto as any;

    const qb = this.empRepo.createQueryBuilder('e');
    if (employeeId) qb.andWhere('e.id = :id', { id: employeeId });
    const emps = await qb.getMany();

    const created: Payroll[] = [];
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

      const ev: PayrollProcessedEvent = { payrollId: saved.id, employeeId: e.id, periodStart, periodEnd, netPay: Number(saved.netPay) };
      this.eventBus.publish('PayrollProcessed', ev);

      created.push(saved);
    }

    return created;
  }
}
