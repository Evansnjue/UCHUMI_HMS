var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsUUID, IsArray, ValidateNested, IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
class CreateBillingItemDto {
}
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateBillingItemDto.prototype, "description", void 0);
__decorate([
    IsNumber(),
    Min(1),
    __metadata("design:type", Number)
], CreateBillingItemDto.prototype, "quantity", void 0);
__decorate([
    IsNumber(),
    Min(0),
    __metadata("design:type", Number)
], CreateBillingItemDto.prototype, "unitPrice", void 0);
export class CreateInvoiceDto {
}
__decorate([
    IsUUID(),
    IsOptional(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "patientId", void 0);
__decorate([
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => CreateBillingItemDto),
    __metadata("design:type", Array)
], CreateInvoiceDto.prototype, "items", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "insuranceProvider", void 0);
__decorate([
    IsNumber(),
    IsOptional(),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "insuranceCoveredAmount", void 0);
//# sourceMappingURL=create-invoice.dto.js.map