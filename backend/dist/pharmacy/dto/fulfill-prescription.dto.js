var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsArray, IsUUID, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
class FulfillItemDto {
}
__decorate([
    IsUUID(),
    __metadata("design:type", String)
], FulfillItemDto.prototype, "prescriptionItemId", void 0);
__decorate([
    IsNumber(),
    Min(1),
    __metadata("design:type", Number)
], FulfillItemDto.prototype, "quantity", void 0);
export class FulfillPrescriptionDto {
}
__decorate([
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => FulfillItemDto),
    __metadata("design:type", Array)
], FulfillPrescriptionDto.prototype, "items", void 0);
//# sourceMappingURL=fulfill-prescription.dto.js.map