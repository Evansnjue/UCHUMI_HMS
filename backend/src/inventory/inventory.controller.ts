import { Controller, Get, Param, Post, Body, UseGuards, Query, Request } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { AddStockDto } from './dto/add-stock.dto';
import { RemoveStockDto } from './dto/remove-stock.dto';
import { TransferStockDto } from './dto/transfer-stock.dto';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private svc: InventoryService) {}

  @Get('items')
  @Roles('Admin', 'Pharmacist', 'SupplyManager')
  async list(@Query('limit') limit = '100', @Query('offset') offset = '0') {
    return this.svc.listItems(Number(limit), Number(offset));
  }

  @Get('items/low')
  @Roles('Admin', 'Pharmacist', 'SupplyManager')
  async low(@Query('threshold') threshold = '5') {
    return this.svc.listLowStock(Number(threshold));
  }

  @Get('items/:id')
  @Roles('Admin', 'Pharmacist', 'SupplyManager')
  async get(@Param('id') id: string) {
    return this.svc.getItem(id);
  }

  @Post('items/add')
  @Roles('Admin', 'SupplyManager')
  async add(@Body() dto: AddStockDto, @Request() req: any) {
    return this.svc.addStock(dto.itemId, dto.quantity, dto.reason, req.user?.id);
  }

  @Post('items/remove')
  @Roles('Admin', 'SupplyManager')
  async remove(@Body() dto: RemoveStockDto, @Request() req: any) {
    return this.svc.removeStock(dto.itemId, dto.quantity, dto.reason, req.user?.id);
  }

  @Post('items/transfer')
  @Roles('Admin', 'SupplyManager')
  async transfer(@Body() dto: TransferStockDto, @Request() req: any) {
    return this.svc.transferStock(dto.itemId, dto.toDepartmentId, dto.quantity, dto.reason, req.user?.id);
  }
}
