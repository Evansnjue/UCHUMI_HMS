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
import { Controller, Get, Param, Post, Body, UseGuards, Query, Request } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { AddStockDto } from './dto/add-stock.dto';
import { RemoveStockDto } from './dto/remove-stock.dto';
import { TransferStockDto } from './dto/transfer-stock.dto';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
let InventoryController = class InventoryController {
    constructor(svc) {
        this.svc = svc;
    }
    async list(limit = '100', offset = '0') {
        return this.svc.listItems(Number(limit), Number(offset));
    }
    async low(threshold = '5') {
        return this.svc.listLowStock(Number(threshold));
    }
    async get(id) {
        return this.svc.getItem(id);
    }
    async add(dto, req) {
        return this.svc.addStock(dto.itemId, dto.quantity, dto.reason, req.user?.id);
    }
    async remove(dto, req) {
        return this.svc.removeStock(dto.itemId, dto.quantity, dto.reason, req.user?.id);
    }
    async transfer(dto, req) {
        return this.svc.transferStock(dto.itemId, dto.toDepartmentId, dto.quantity, dto.reason, req.user?.id);
    }
};
__decorate([
    Get('items'),
    Roles('Admin', 'Pharmacist', 'SupplyManager'),
    __param(0, Query('limit')),
    __param(1, Query('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "list", null);
__decorate([
    Get('items/low'),
    Roles('Admin', 'Pharmacist', 'SupplyManager'),
    __param(0, Query('threshold')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "low", null);
__decorate([
    Get('items/:id'),
    Roles('Admin', 'Pharmacist', 'SupplyManager'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "get", null);
__decorate([
    Post('items/add'),
    Roles('Admin', 'SupplyManager'),
    __param(0, Body()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddStockDto, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "add", null);
__decorate([
    Post('items/remove'),
    Roles('Admin', 'SupplyManager'),
    __param(0, Body()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RemoveStockDto, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "remove", null);
__decorate([
    Post('items/transfer'),
    Roles('Admin', 'SupplyManager'),
    __param(0, Body()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TransferStockDto, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "transfer", null);
InventoryController = __decorate([
    Controller('inventory'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [InventoryService])
], InventoryController);
export { InventoryController };
//# sourceMappingURL=inventory.controller.js.map