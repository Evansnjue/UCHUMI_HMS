var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsUUID, IsNumber, Min, IsString, IsOptional } from 'class-validator';
export class TransferStockDto {
}
__decorate([
    IsUUID(),
    __metadata("design:type", String)
], TransferStockDto.prototype, "itemId", void 0);
__decorate([
    IsUUID(),
    __metadata("design:type", String)
], TransferStockDto.prototype, "toDepartmentId", void 0);
__decorate([
    IsNumber(),
    Min(1),
    __metadata("design:type", Number)
], TransferStockDto.prototype, "quantity", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], TransferStockDto.prototype, "reason", void 0);
//# sourceMappingURL=transfer-stock.dto.js.map