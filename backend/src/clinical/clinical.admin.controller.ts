import { Controller, Post, Body, UseGuards, Get, Param, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ClinicalService } from './clinical.service';

@Controller('clinical/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin')
export class ClinicalAdminController {
  constructor(private svc: ClinicalService) {}

  @Get('drug-categories')
  async listCategories() {
    return this.svc.listCategories();
  }

  @Post('drug-categories')
  async createCategory(@Body() body: { name: string; dailyLimit?: number }) {
    return this.svc.createCategory(body.name, body.dailyLimit || 0);
  }

  @Patch('drug-categories/:id')
  async updateCategory(@Param('id') id: string, @Body() body: { dailyLimit?: number; name?: string }) {
    return this.svc.updateCategory(id, body);
  }

  @Post('doctor-limits')
  async setDoctorLimit(@Body() body: { doctorId: string; categoryId: string; dailyLimit: number }) {
    return this.svc.setDoctorLimit(body.doctorId, body.categoryId, body.dailyLimit);
  }

  @Get('doctor-limits/:doctorId')
  async getDoctorLimits(@Param('doctorId') doctorId: string) {
    return this.svc.getDoctorLimits(doctorId);
  }
}
