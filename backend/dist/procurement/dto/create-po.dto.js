var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsUUID, IsArray, ValidateNested, IsNumber, Min, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
class POItemDto {
}
__decorate([
    IsString(),
    __metadata("design:type", String)
], POItemDto.prototype, "description", void 0);
__decorate([
    IsNumber(),
    Min(1),
    __metadata("design:type", Number)
], POItemDto.prototype, "quantity", void 0);
__decorate([
    IsNumber(),
    Min(0),
    __metadata("design:type", Number)
], POItemDto.prototype, "unitPrice", void 0);
export class CreatePODto {
}
__decorate([
    IsUUID(),
    __metadata("design:type", String)
], CreatePODto.prototype, "supplierId", void 0);
__decorate([
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => POItemDto),
    __metadata("design:type", Array)
], CreatePODto.prototype, "items", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreatePODto.prototype, "currency", void 0);
export class ApprovePODto {
}
__decorate([
    IsUUID(),
    __metadata("design:type", String)
], ApprovePODto.prototype, "approverId", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], ApprovePODto.prototype, "notes", void 0);
//# sourceMappingURL=create-po.dto.js.map