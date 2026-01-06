import { Controller, Post, Body, UseGuards, Req, Get, Param } from '@nestjs/common';
import { LabService } from './lab.service';
import { CreateLabResultDto } from './dto/create-lab-result.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('lab')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LabController {
  constructor(private svc: LabService) {}

  @Roles('LabTechnician')
  @Post('results')
  async createResult(@Body() dto: CreateLabResultDto, @Req() req: any) {
    return this.svc.createResult(dto, req.user);
  }

  @Roles('LabTechnician', 'Doctor', 'Admin')
  @Get('request/:id/results')
  async resultsForRequest(@Param('id') id: string) {
    return this.svc.getResultsForRequest(id);
  }

  @Roles('LabTechnician')
  @Get('pending')
  async pending() {
    return this.svc.listPendingForDepartment('');
  }
}
