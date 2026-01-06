import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PatientNumberService } from './patient-number.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('patients/numbers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientNumberController {
  constructor(private svc: PatientNumberService) {}

  @Roles('Receptionist', 'Admin')
  @Post()
  async generate(@Body() body: { type: 'OPD' | 'IPD' }) {
    return { number: await this.svc.generate(body.type) };
  }
}
