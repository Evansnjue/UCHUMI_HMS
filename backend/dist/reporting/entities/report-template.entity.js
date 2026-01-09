var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
let ReportTemplate = class ReportTemplate {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], ReportTemplate.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], ReportTemplate.prototype, "name", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], ReportTemplate.prototype, "department", void 0);
__decorate([
    Column({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], ReportTemplate.prototype, "description", void 0);
__decorate([
    Column({ name: 'kpi_definitions', type: 'jsonb' }),
    __metadata("design:type", Object)
], ReportTemplate.prototype, "kpiDefinitions", void 0);
__decorate([
    Column({ name: 'default_params', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ReportTemplate.prototype, "defaultParams", void 0);
__decorate([
    Column({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], ReportTemplate.prototype, "createdBy", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' }),
    __metadata("design:type", Date)
], ReportTemplate.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ReportTemplate.prototype, "updatedAt", void 0);
ReportTemplate = __decorate([
    Entity({ name: 'reporting_templates' })
], ReportTemplate);
export { ReportTemplate };
//# sourceMappingURL=report-template.entity.js.map