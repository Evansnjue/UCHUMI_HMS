var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ReportTemplate } from './report-template.entity';
let Report = class Report {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Report.prototype, "id", void 0);
__decorate([
    ManyToOne(() => ReportTemplate, { nullable: true, onDelete: 'SET NULL' }),
    JoinColumn({ name: 'template_id' }),
    __metadata("design:type", ReportTemplate)
], Report.prototype, "template", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Report.prototype, "name", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Report.prototype, "department", void 0);
__decorate([
    Column({ name: 'period_start', type: 'date' }),
    __metadata("design:type", String)
], Report.prototype, "periodStart", void 0);
__decorate([
    Column({ name: 'period_end', type: 'date' }),
    __metadata("design:type", String)
], Report.prototype, "periodEnd", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Report.prototype, "type", void 0);
__decorate([
    Column({ name: 'generated_by', nullable: true }),
    __metadata("design:type", String)
], Report.prototype, "generatedBy", void 0);
__decorate([
    Column({ name: 'generated_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Report.prototype, "generatedAt", void 0);
__decorate([
    Column({ type: 'jsonb' }),
    __metadata("design:type", Object)
], Report.prototype, "payload", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Report.prototype, "status", void 0);
__decorate([
    Column({ name: 'exported_to', nullable: true }),
    __metadata("design:type", String)
], Report.prototype, "exportedTo", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' }),
    __metadata("design:type", Date)
], Report.prototype, "createdAt", void 0);
Report = __decorate([
    Entity({ name: 'reporting_reports' })
], Report);
export { Report };
//# sourceMappingURL=report.entity.js.map