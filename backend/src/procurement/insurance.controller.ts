import { Controller, Post, Body, UseGuards, Get, Param, Query, Req } from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateClaimDto, ProcessClaimDto } from './dto/create-claim.dto';

@Controller('insurance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InsuranceController {
  constructor(private svc: InsuranceService) {}

  @Post('claims')
  @Roles('Admin', 'InsuranceOfficer')
  async createClaim(@Body() dto: CreateClaimDto, @Req() req: any) {
    return this.svc.createClaim(dto, req.user.id);
  }

  @Post('claims/:id/process')
  @Roles('Admin', 'InsuranceOfficer')
  async processClaim(@Param('id') id: string, @Body() dto: ProcessClaimDto, @Req() req: any) {
    return this.svc.processClaim(id, dto, req.user.id);
  }

  @Get('claims')
  @Roles('Admin', 'InsuranceOfficer', 'Accountant')
  async listClaims(@Query('status') status?: string, @Query('insurer') insurer?: string) {
    return this.svc.listClaims({ status, insurer });
  }
}
