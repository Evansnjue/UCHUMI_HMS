var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
let InsuranceClaim = class InsuranceClaim {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], InsuranceClaim.prototype, "id", void 0);
__decorate([
    Column({ name: 'patient_id', nullable: true }),
    __metadata("design:type", String)
], InsuranceClaim.prototype, "patientId", void 0);
__decorate([
    Column({ name: 'claim_number', unique: true }),
    __metadata("design:type", String)
], InsuranceClaim.prototype, "claimNumber", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], InsuranceClaim.prototype, "insurer", void 0);
__decorate([
    Column({ type: 'numeric', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], InsuranceClaim.prototype, "amount", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], InsuranceClaim.prototype, "status", void 0);
__decorate([
    Column({ name: 'submitted_by', nullable: true }),
    __metadata("design:type", String)
], InsuranceClaim.prototype, "submittedBy", void 0);
__decorate([
    Column({ name: 'processed_by', nullable: true }),
    __metadata("design:type", String)
], InsuranceClaim.prototype, "processedBy", void 0);
__decorate([
    Column({ name: 'processed_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], InsuranceClaim.prototype, "processedAt", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], InsuranceClaim.prototype, "notes", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' }),
    __metadata("design:type", Date)
], InsuranceClaim.prototype, "createdAt", void 0);
InsuranceClaim = __decorate([
    Entity({ name: 'procurement_insurance_claims' })
], InsuranceClaim);
export { InsuranceClaim };
//# sourceMappingURL=insurance-claim.entity.js.map