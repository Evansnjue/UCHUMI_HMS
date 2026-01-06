import { Controller, Post, Body, Get, Query, Param, Patch, UseGuards } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { SearchPatientDto } from './dto/search-patient.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

/**
 * Patient endpoints are protected. Only Receptionist, Doctor or Admin can create, update or search patients.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('patients')
export class PatientController {
  constructor(private svc: PatientService) {}

  @Roles('Receptionist', 'Doctor', 'Admin')
  @Post()
  async create(@Body() dto: CreatePatientDto) {
    return this.svc.create(dto);
  }

  @Roles('Receptionist', 'Doctor', 'Admin')
  @Get()
  async search(@Query() q: SearchPatientDto) {
    return this.svc.search(q.query, q.department);
  }

  @Roles('Receptionist', 'Doctor', 'Admin')
  @Get(':id')
  async get(@Param('id') id: string) {
    return this.svc.findById(id);
  }

  @Roles('Receptionist', 'Doctor', 'Admin')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePatientDto) {
    return this.svc.update(id, dto);
  }
}
