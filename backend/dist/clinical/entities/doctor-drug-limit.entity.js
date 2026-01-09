var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { DrugCategory } from './drug-category.entity';
let DoctorDrugLimit = class DoctorDrugLimit {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], DoctorDrugLimit.prototype, "id", void 0);
__decorate([
    ManyToOne(() => User, { eager: true }),
    __metadata("design:type", User)
], DoctorDrugLimit.prototype, "doctor", void 0);
__decorate([
    ManyToOne(() => DrugCategory, { eager: true }),
    __metadata("design:type", DrugCategory)
], DoctorDrugLimit.prototype, "category", void 0);
__decorate([
    Column({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], DoctorDrugLimit.prototype, "dailyLimit", void 0);
DoctorDrugLimit = __decorate([
    Entity({ name: 'doctor_drug_limits' })
], DoctorDrugLimit);
export { DoctorDrugLimit };
//# sourceMappingURL=doctor-drug-limit.entity.js.map