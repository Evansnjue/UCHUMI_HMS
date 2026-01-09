var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ReportingService_1;
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { ReportTemplate } from './entities/report-template.entity';
import { EventBusService } from '../auth/event-bus.service';
let ReportingService = ReportingService_1 = class ReportingService {
    constructor(reportRepo, tplRepo, eventBus) {
        this.reportRepo = reportRepo;
        this.tplRepo = tplRepo;
        this.eventBus = eventBus;
        this.logger = new Logger(ReportingService_1.name);
    }
    async createTemplate(dto, actorId) {
        const tpl = this.tplRepo.create({ ...dto, createdBy: actorId });
        return this.tplRepo.save(tpl);
    }
    async listTemplates(department) {
        const qb = this.tplRepo.createQueryBuilder('t');
        if (department)
            qb.where('t.department = :d', { d: department });
        return qb.getMany();
    }
    async getTemplate(id) {
        const t = await this.tplRepo.findOne({ where: { id } });
        if (!t)
            throw new NotFoundException('template not found');
        return t;
    }
    async generateReport(dto, actorId) {
        // role checks are enforced at controller, but check again if needed
        const tpl = await this.tplRepo.findOne({ where: { id: dto.templateId } });
        if (!tpl)
            throw new NotFoundException('template not found');
        // create initial Report record with PROCESSING status and minimal payload
        const rec = this.reportRepo.create({ template: tpl, name: tpl.name, department: tpl.department, periodStart: dto.periodStart, periodEnd: dto.periodEnd, type: dto.type || 'DAILY', generatedBy: actorId, status: 'PROCESSING', payload: {} });
        const saved = await this.reportRepo.save(rec);
        // For production this should be performed in a job queue (Bull) to avoid long sync work
        try {
            const payload = await this.computeKpisForTemplate(tpl, dto.periodStart, dto.periodEnd);
            saved.payload = payload;
            saved.status = 'READY';
            saved.generatedAt = new Date();
            await this.reportRepo.save(saved);
            const ev = { reportId: saved.id, templateId: tpl.id, generatedAt: saved.generatedAt.toISOString(), department: tpl.department, type: saved.type };
            this.eventBus.publish('ReportGenerated', ev);
            return saved;
        }
        catch (err) {
            this.logger.error('report generation failed', err);
            saved.status = 'FAILED';
            await this.reportRepo.save(saved);
            throw err;
        }
    }
    // Compute KPIs by evaluating definitions in template. For now, support a small set of canned KPIs.
    async computeKpisForTemplate(tpl, start, end) {
        // Example KPI definitions format:
        // { "patient_flow": { "type":"count", "source": "visit", "field": "id" }, "revenue": { "type":"sum", "source":"payments", "field": "amount" } }
        const defs = tpl.kpiDefinitions || {};
        const result = { meta: { templateId: tpl.id, start, end }, kpis: {} };
        for (const [k, def] of Object.entries(defs)) {
            // Implement a small set of known KPI computations by delegating to repo-specific queries
            if (def.source === 'visits') {
                // count visits from visit table for the period
                const qb = this.reportRepo.manager.createQueryBuilder().select('COUNT(v.id)', 'value').from('visit', 'v').where('v.created_at::date >= :start AND v.created_at::date <= :end', { start, end });
                if (tpl.department)
                    qb.andWhere('v.department = :d', { d: tpl.department });
                const raw = await qb.getRawOne();
                result.kpis[k] = Number(raw?.value || 0);
            }
            else if (def.source === 'inventory_usage') {
                const qb = this.reportRepo.manager.createQueryBuilder().select('SUM(s.quantity)', 'value').from('stock_movement', 's').where('s.created_at::date >= :start AND s.created_at::date <= :end', { start, end });
                if (tpl.department)
                    qb.andWhere('s.department = :d', { d: tpl.department });
                const raw = await qb.getRawOne();
                result.kpis[k] = Number(raw?.value || 0);
            }
            else if (def.source === 'payments') {
                const qb = this.reportRepo.manager.createQueryBuilder().select('SUM(p.amount)', 'value').from('payment', 'p').where('p.created_at::date >= :start AND p.created_at::date <= :end', { start, end });
                const raw = await qb.getRawOne();
                result.kpis[k] = Number(raw?.value || 0);
            }
            else {
                // unsupported KPI type — store definition for manual evaluation
                result.kpis[k] = { unsupported: true, def };
            }
        }
        return result;
    }
    async fetchReport(id, actorRoles) {
        const r = await this.reportRepo.findOne({ where: { id }, relations: ['template'] });
        if (!r)
            throw new NotFoundException('report not found');
        // Business rule: only Admin/HR can view full report; others get sanitized view
        const allowed = actorRoles.includes('Admin') || actorRoles.includes('HR');
        if (!allowed) {
            // return only kpi summaries (redact detailed fields if present)
            return { id: r.id, name: r.name, department: r.department, periodStart: r.periodStart, periodEnd: r.periodEnd, type: r.type, status: r.status, payload: { meta: r.payload?.meta, kpis: r.payload?.kpis } };
        }
        return r;
    }
    async listReports(filter) {
        const qb = this.reportRepo.createQueryBuilder('r');
        if (filter.department)
            qb.andWhere('r.department = :d', { d: filter.department });
        if (filter.start)
            qb.andWhere('r.period_start >= :start', { start: filter.start });
        if (filter.end)
            qb.andWhere('r.period_end <= :end', { end: filter.end });
        qb.orderBy('r.generated_at', 'DESC');
        return qb.getMany();
    }
};
ReportingService = ReportingService_1 = __decorate([
    Injectable(),
    __param(0, InjectRepository(Report)),
    __param(1, InjectRepository(ReportTemplate)),
    __metadata("design:paramtypes", [Repository,
        Repository,
        EventBusService])
], ReportingService);
export { ReportingService };
//# sourceMappingURL=reporting.service.js.map