var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
let TestCatalog = class TestCatalog {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], TestCatalog.prototype, "id", void 0);
__decorate([
    Column({ unique: true }),
    __metadata("design:type", String)
], TestCatalog.prototype, "code", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], TestCatalog.prototype, "name", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], TestCatalog.prototype, "description", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], TestCatalog.prototype, "defaultUnits", void 0);
TestCatalog = __decorate([
    Entity({ name: 'test_catalog' })
], TestCatalog);
export { TestCatalog };
//# sourceMappingURL=test-catalog.entity.js.map