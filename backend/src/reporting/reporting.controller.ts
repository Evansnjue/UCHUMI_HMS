import { Controller, Post, Body, UseGuards, Get, Param, Query, Req } from '@nestjs/common';
import { ReportingService } from './reporting.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateTemplateDto } from './dto/create-template.dto';
import { GenerateReportDto } from './dto/generate-report.dto';

@Controller('reporting')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportingController {
  constructor(private svc: ReportingService) {}

  @Post('templates')
  @Roles('Admin', 'HR')
  async createTemplate(@Body() dto: CreateTemplateDto, @Req() req: any) {
    return this.svc.createTemplate(dto, req.user.id);
  }

  @Get('templates')
  @Roles('Admin', 'HR')
  async listTemplates(@Query('department') department?: string) {
    return this.svc.listTemplates(department);
  }

  @Post('generate')
  @Roles('Admin', 'HR')
  async generateReport(@Body() dto: GenerateReportDto, @Req() req: any) {
    return this.svc.generateReport(dto, req.user.id);
  }

  @Get(':id')
  @Roles('Admin', 'HR', 'Doctor', 'Receptionist', 'Pharmacist')
  async getReport(@Param('id') id: string, @Req() req: any) {
    const roles = req.user?.roles?.map((r: any) => r.name || r) || [];
    return this.svc.fetchReport(id, roles);
  }

  @Get()
  @Roles('Admin', 'HR')
  async listReports(@Query('department') department?: string, @Query('start') start?: string, @Query('end') end?: string) {
    return this.svc.listReports({ department, start, end });
  }
}
