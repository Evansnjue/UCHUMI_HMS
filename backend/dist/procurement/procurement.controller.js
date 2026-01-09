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
import { Controller, Post, Body, UseGuards, Get, Param, Query, Req, Put } from '@nestjs/common';
import { ProcurementService } from './procurement.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { CreatePODto, ApprovePODto } from './dto/create-po.dto';
let ProcurementController = class ProcurementController {
    constructor(svc) {
        this.svc = svc;
    }
    async createSupplier(dto) {
        return this.svc.createSupplier(dto);
    }
    async getSupplier(id) {
        return this.svc.getSupplier(id);
    }
    async createPurchaseOrder(dto, req) {
        return this.svc.createPurchaseOrder(dto, req.user.id);
    }
    async approvePurchaseOrder(id, dto, req) {
        return this.svc.approvePurchaseOrder(id, dto, req.user.id);
    }
    async listPOs(status, supplierId) {
        return this.svc.listPurchaseOrders({ status, supplierId });
    }
};
__decorate([
    Post('suppliers'),
    Roles('Admin', 'SupplyManager'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateSupplierDto]),
    __metadata("design:returntype", Promise)
], ProcurementController.prototype, "createSupplier", null);
__decorate([
    Get('suppliers/:id'),
    Roles('Admin', 'SupplyManager'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProcurementController.prototype, "getSupplier", null);
__decorate([
    Post('purchase-orders'),
    Roles('Admin', 'SupplyManager'),
    __param(0, Body()),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreatePODto, Object]),
    __metadata("design:returntype", Promise)
], ProcurementController.prototype, "createPurchaseOrder", null);
__decorate([
    Put('purchase-orders/:id/approve'),
    Roles('Admin', 'SupplyManager'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ApprovePODto, Object]),
    __metadata("design:returntype", Promise)
], ProcurementController.prototype, "approvePurchaseOrder", null);
__decorate([
    Get('purchase-orders'),
    Roles('Admin', 'SupplyManager', 'Accountant'),
    __param(0, Query('status')),
    __param(1, Query('supplierId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProcurementController.prototype, "listPOs", null);
ProcurementController = __decorate([
    Controller('procurement'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [ProcurementService])
], ProcurementController);
export { ProcurementController };
//# sourceMappingURL=procurement.controller.js.map