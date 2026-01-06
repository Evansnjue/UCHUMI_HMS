import { Controller, Post, Body, UseGuards, Param, Get, Delete } from '@nestjs/common';
import { VisitService } from './visit.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('visits')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VisitController {
  constructor(private svc: VisitService) {}

  @Roles('Receptionist', 'Doctor', 'Admin')
  @Post()
  async create(@Body() dto: CreateVisitDto) {
    return this.svc.create(dto);
  }

  @Roles('Receptionist', 'Doctor', 'Admin')
  @Post(':id/complete')
  async complete(@Param('id') id: string) {
    return this.svc.complete(id);
  }

  @Roles('Receptionist', 'Doctor', 'Admin')
  @Get('queue/:department')
  async getQueue(@Param('department') department: string) {
    return this.svc.getQueue(department);
  }

  @Roles('Receptionist', 'Doctor', 'Admin')
  @Post('queue/:department/next')
  async next(@Param('department') department: string) {
    return this.svc.nextInQueue(department);
  }

  @Roles('Receptionist', 'Doctor', 'Admin')
  @Get('patient/:id/history')
  async history(@Param('id') patientId: string) {
    return this.svc.historyForPatient(patientId);
  }
}
