var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsOptional, IsDateString, IsEmail, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
class PatientNumberDto {
}
__decorate([
    IsString(),
    __metadata("design:type", String)
], PatientNumberDto.prototype, "type", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], PatientNumberDto.prototype, "number", void 0);
class PatientDepartmentDto {
}
__decorate([
    IsString(),
    __metadata("design:type", String)
], PatientDepartmentDto.prototype, "departmentCode", void 0);
export class UpdatePatientDto {
}
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdatePatientDto.prototype, "firstName", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdatePatientDto.prototype, "middleName", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdatePatientDto.prototype, "lastName", void 0);
__decorate([
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], UpdatePatientDto.prototype, "dateOfBirth", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdatePatientDto.prototype, "gender", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdatePatientDto.prototype, "phone", void 0);
__decorate([
    IsOptional(),
    IsEmail(),
    __metadata("design:type", String)
], UpdatePatientDto.prototype, "email", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdatePatientDto.prototype, "address", void 0);
__decorate([
    IsOptional(),
    ValidateNested({ each: true }),
    Type(() => PatientNumberDto),
    __metadata("design:type", Array)
], UpdatePatientDto.prototype, "numbers", void 0);
__decorate([
    IsOptional(),
    ValidateNested({ each: true }),
    Type(() => PatientDepartmentDto),
    __metadata("design:type", Array)
], UpdatePatientDto.prototype, "departments", void 0);
//# sourceMappingURL=update-patient.dto.js.map