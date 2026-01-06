import { Controller, Post, Body, UseGuards, Get, Param, Query } from '@nestjs/common';
import { HRService } from './hr.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CheckInDto, CheckOutDto } from './dto/checkin.dto';
import { GeneratePayrollDto } from './dto/payroll.dto';

@Controller('hr')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HRController {
  constructor(private svc: HRService) {}

  @Post('employees')
  @Roles('HR', 'Admin')
  async createEmployee(@Body() dto: CreateEmployeeDto) {
    return this.svc.createEmployee(dto);
  }

  @Get('employees/:id')
  @Roles('HR', 'Admin')
  async getEmployee(@Param('id') id: string) {
    return this.svc.getEmployee(id);
  }

  @Post('attendance/checkin')
  @Roles('HR', 'Admin', 'Receptionist')
  async checkIn(@Body() dto: CheckInDto) {
    return this.svc.checkIn(dto);
  }

  @Post('attendance/checkout')
  @Roles('HR', 'Admin', 'Receptionist')
  async checkOut(@Body() dto: CheckOutDto) {
    return this.svc.checkOut(dto);
  }

  @Get('attendance/report')
  @Roles('HR', 'Admin')
  async attendanceReport(@Query('start') start: string, @Query('end') end: string) {
    return this.svc.unpaidOvertimeReport(start, end);
  }

  @Post('payroll/generate')
  @Roles('HR', 'Admin')
  async generatePayroll(@Body() dto: GeneratePayrollDto) {
    return this.svc.generatePayroll(dto);
  }
}
