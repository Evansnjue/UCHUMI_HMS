var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Post, Body, UseGuards, Request, Get, Param, Query } from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
let BillingController = class BillingController {
    constructor(svc) {
        this.svc = svc;
    }
    async createInvoice(dto, req) {
        return this.svc.generateInvoice(dto, req.user?.id);
    }
    async getInvoice(id) {
        return this.svc.getInvoice(id);
    }
    async list(limit = '50', offset = '0') {
        return this.svc.listInvoices(Number(limit), Number(offset));
    }
    async pay(id, dto, req) {
        // ensure dto.invoiceId matches path id
        dto.invoiceId = id;
        return this.svc.recordPayment(dto, req.user?.id);
    }
    async revenue(period = 'day') {
        return this.svc.revenueReport(period);
    }
    async unpaidInsurance() {
        return this.svc.unpaidInsuranceClaims();
    }
};
__decorate([
    Post('invoices'),
    Roles('Admin', 'Receptionist', 'Accountant'),
    __param(0, Body()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateInvoiceDto, Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "createInvoice", null);
__decorate([
    Get('invoices/:id'),
    Roles('Admin', 'Accountant', 'Receptionist', 'Doctor'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "getInvoice", null);
__decorate([
    Get('invoices'),
    Roles('Admin', 'Accountant'),
    __param(0, Query('limit')),
    __param(1, Query('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "list", null);
__decorate([
    Post('invoices/:id/payments'),
    Roles('Admin', 'Receptionist', 'Accountant'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreatePaymentDto, Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "pay", null);
__decorate([
    Get('reports/revenue'),
    Roles('Admin', 'Accountant'),
    __param(0, Query('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "revenue", null);
__decorate([
    Get('reports/unpaid-insurance'),
    Roles('Admin', 'Accountant'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "unpaidInsurance", null);
BillingController = __decorate([
    Controller('billing'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [BillingService])
], BillingController);
export { BillingController };
//# sourceMappingURL=billing.controller.js.map