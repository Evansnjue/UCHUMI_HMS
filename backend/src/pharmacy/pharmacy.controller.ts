import { Controller, Get, Param, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { FulfillPrescriptionDto } from './dto/fulfill-prescription.dto';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { PharmacyStockService } from './pharmacy.stock.service';
import { AdjustStockDto } from './dto/adjust-stock.dto';

@Controller('pharmacy')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PharmacyController {
  constructor(private svc: PharmacyService, private stockService: PharmacyStockService) {}

  /**
   * GET /pharmacy/prescriptions?status=PENDING
   * Returns pending prescriptions to be fulfilled by pharmacists.
   */
  @Get('prescriptions')
  @Roles('Pharmacist', 'Admin')
  async listPending(@Query('limit') limit = '50', @Query('offset') offset = '0') {
    return this.svc.listPendingPrescriptions(Number(limit), Number(offset));
  }

  /**
   * GET /pharmacy/prescriptions/:id
   */
  @Get('prescriptions/:id')
  @Roles('Pharmacist', 'Admin')
  async get(@Param('id') id: string) {
    return this.svc.getPrescription(id);
  }

  /**
   * POST /pharmacy/prescriptions/:id/fulfill
   * Body: { items: [{ prescriptionItemId, quantity }] }
   */
  @Post('prescriptions/:id/fulfill')
  @Roles('Pharmacist', 'Admin')
  async fulfill(@Param('id') id: string, @Body() dto: FulfillPrescriptionDto, @Request() req: any) {
    const pharmacistId = req.user?.id;
    return this.svc.fulfillPrescription(id, dto.items, pharmacistId);
  }

  /** GET /pharmacy/stock */
  @Get('stock')
  @Roles('Pharmacist', 'Admin')
  async listStock(@Query('limit') limit = '100', @Query('offset') offset = '0', @Query('location') _loc?: string) {
    return (this as any).stockService.list(Number(limit), Number(offset));
  }

  /** POST /pharmacy/stock/:id/adjust */
  @Post('stock/:id/adjust')
  @Roles('Pharmacist', 'Admin')
  async adjustStock(@Param('id') id: string, @Body() dto: any, @Request() req: any) {
    const performedBy = req.user?.id;
    return (this as any).stockService.adjustStock(id, dto.delta, dto.reason, performedBy);
  }
}
