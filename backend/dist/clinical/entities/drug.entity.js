var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { DrugCategory } from './drug-category.entity';
let Drug = class Drug {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Drug.prototype, "id", void 0);
__decorate([
    Column({ unique: true }),
    __metadata("design:type", String)
], Drug.prototype, "name", void 0);
__decorate([
    ManyToOne(() => DrugCategory, (c) => c.drugs, { eager: true }),
    __metadata("design:type", DrugCategory)
], Drug.prototype, "category", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Drug.prototype, "description", void 0);
Drug = __decorate([
    Entity({ name: 'drugs' })
], Drug);
export { Drug };
//# sourceMappingURL=drug.entity.js.map