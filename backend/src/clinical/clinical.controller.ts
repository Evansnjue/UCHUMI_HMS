import { Controller, Post, Body, UseGuards, Req, Get, Param } from '@nestjs/common';
import { ClinicalService } from './clinical.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { CreateLabRequestDto } from './dto/create-lab-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('clinical')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClinicalController {
  constructor(private svc: ClinicalService) {}

  @Roles('Doctor')
  @Post('consultations')
  async createConsultation(@Body() dto: CreateConsultationDto, @Req() req: any) {
    return this.svc.createConsultation(dto, req.user);
  }

  @Roles('Doctor')
  @Post('prescriptions')
  async createPrescription(@Body() dto: CreatePrescriptionDto, @Req() req: any) {
    return this.svc.createPrescription(dto, req.user);
  }

  @Roles('Doctor')
  @Post('lab-requests')
  async createLabRequest(@Body() dto: CreateLabRequestDto, @Req() req: any) {
    return this.svc.createLabRequest(dto, req.user);
  }

  @Roles('Doctor', 'Receptionist', 'Admin')
  @Get('patient/:id/consultations')
  async consultationsForPatient(@Param('id') id: string) {
    return this.svc.consultationsForPatient(id);
  }
}
