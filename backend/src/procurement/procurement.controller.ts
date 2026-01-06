import { Controller, Post, Body, UseGuards, Get, Param, Query, Req, Put } from '@nestjs/common';
import { ProcurementService } from './procurement.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { CreatePODto, ApprovePODto } from './dto/create-po.dto';

@Controller('procurement')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProcurementController {
  constructor(private svc: ProcurementService) {}

  @Post('suppliers')
  @Roles('Admin', 'SupplyManager')
  async createSupplier(@Body() dto: CreateSupplierDto) {
    return this.svc.createSupplier(dto);
  }

  @Get('suppliers/:id')
  @Roles('Admin', 'SupplyManager')
  async getSupplier(@Param('id') id: string) {
    return this.svc.getSupplier(id);
  }

  @Post('purchase-orders')
  @Roles('Admin', 'SupplyManager')
  async createPurchaseOrder(@Body() dto: CreatePODto, @Req() req: any) {
    return this.svc.createPurchaseOrder(dto, req.user.id);
  }

  @Put('purchase-orders/:id/approve')
  @Roles('Admin', 'SupplyManager')
  async approvePurchaseOrder(@Param('id') id: string, @Body() dto: ApprovePODto, @Req() req: any) {
    return this.svc.approvePurchaseOrder(id, dto, req.user.id);
  }

  @Get('purchase-orders')
  @Roles('Admin', 'SupplyManager', 'Accountant')
  async listPOs(@Query('status') status?: string, @Query('supplierId') supplierId?: string) {
    return this.svc.listPurchaseOrders({ status, supplierId });
  }
}
