import { Controller, Post, Body, UseGuards, Request, Get, Param, Query } from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('billing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BillingController {
  constructor(private svc: BillingService) {}

  @Post('invoices')
  @Roles('Admin', 'Receptionist', 'Accountant')
  async createInvoice(@Body() dto: CreateInvoiceDto, @Request() req: any) {
    return this.svc.generateInvoice(dto, req.user?.id);
  }

  @Get('invoices/:id')
  @Roles('Admin', 'Accountant', 'Receptionist', 'Doctor')
  async getInvoice(@Param('id') id: string) {
    return this.svc.getInvoice(id);
  }

  @Get('invoices')
  @Roles('Admin', 'Accountant')
  async list(@Query('limit') limit = '50', @Query('offset') offset = '0') {
    return this.svc.listInvoices(Number(limit), Number(offset));
  }

  @Post('invoices/:id/payments')
  @Roles('Admin', 'Receptionist', 'Accountant')
  async pay(@Param('id') id: string, @Body() dto: CreatePaymentDto, @Request() req: any) {
    // ensure dto.invoiceId matches path id
    dto.invoiceId = id;
    return this.svc.recordPayment(dto, req.user?.id);
  }

  @Get('reports/revenue')
  @Roles('Admin', 'Accountant')
  async revenue(@Query('period') period: 'day' | 'week' | 'month' = 'day') {
    return this.svc.revenueReport(period);
  }

  @Get('reports/unpaid-insurance')
  @Roles('Admin', 'Accountant')
  async unpaidInsurance() {
    return this.svc.unpaidInsuranceClaims();
  }
}
