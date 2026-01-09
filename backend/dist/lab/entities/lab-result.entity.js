var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { TestCatalog } from './test-catalog.entity';
import { LabRequest } from '../../clinical/entities/lab-request.entity';
import { User } from '../../auth/entities/user.entity';
let LabResult = class LabResult {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], LabResult.prototype, "id", void 0);
__decorate([
    ManyToOne(() => LabRequest, { eager: true }),
    __metadata("design:type", LabRequest)
], LabResult.prototype, "labRequest", void 0);
__decorate([
    ManyToOne(() => TestCatalog, { eager: true }),
    __metadata("design:type", TestCatalog)
], LabResult.prototype, "test", void 0);
__decorate([
    Column({ type: 'text' }),
    __metadata("design:type", String)
], LabResult.prototype, "value", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], LabResult.prototype, "units", void 0);
__decorate([
    Column({ default: 'PENDING' }),
    __metadata("design:type", String)
], LabResult.prototype, "status", void 0);
__decorate([
    ManyToOne(() => User, { eager: true }),
    __metadata("design:type", User)
], LabResult.prototype, "enteredBy", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], LabResult.prototype, "createdAt", void 0);
LabResult = __decorate([
    Entity({ name: 'lab_results' })
], LabResult);
export { LabResult };
//# sourceMappingURL=lab-result.entity.js.map