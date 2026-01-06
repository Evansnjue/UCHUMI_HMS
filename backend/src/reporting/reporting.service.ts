import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { ReportTemplate } from './entities/report-template.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
import { GenerateReportDto } from './dto/generate-report.dto';
import { EventBusService } from '../auth/event-bus.service';
import { ReportGeneratedEvent } from './reporting.events';

@Injectable()
export class ReportingService {
  private readonly logger = new Logger(ReportingService.name);

  constructor(
    @InjectRepository(Report) private reportRepo: Repository<Report>,
    @InjectRepository(ReportTemplate) private tplRepo: Repository<ReportTemplate>,
    private eventBus: EventBusService,
  ) {}

  async createTemplate(dto: CreateTemplateDto, actorId?: string) {
    const tpl = this.tplRepo.create({ ...dto, createdBy: actorId });
    return this.tplRepo.save(tpl);
  }

  async listTemplates(department?: string) {
    const qb = this.tplRepo.createQueryBuilder('t');
    if (department) qb.where('t.department = :d', { d: department });
    return qb.getMany();
  }

  async getTemplate(id: string) {
    const t = await this.tplRepo.findOne({ where: { id } });
    if (!t) throw new NotFoundException('template not found');
    return t;
  }

  async generateReport(dto: GenerateReportDto, actorId: string) {
    // role checks are enforced at controller, but check again if needed
    const tpl = await this.tplRepo.findOne({ where: { id: dto.templateId } });
    if (!tpl) throw new NotFoundException('template not found');

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

      const ev: ReportGeneratedEvent = { reportId: saved.id, templateId: tpl.id, generatedAt: saved.generatedAt.toISOString(), department: tpl.department, type: saved.type };
      this.eventBus.publish('ReportGenerated', ev);

      return saved;
    } catch (err) {
      this.logger.error('report generation failed', err);
      saved.status = 'FAILED';
      await this.reportRepo.save(saved);
      throw err;
    }
  }

  // Compute KPIs by evaluating definitions in template. For now, support a small set of canned KPIs.
  private async computeKpisForTemplate(tpl: ReportTemplate, start: string, end: string) {
    // Example KPI definitions format:
    // { "patient_flow": { "type":"count", "source": "visit", "field": "id" }, "revenue": { "type":"sum", "source":"payments", "field": "amount" } }

    const defs = tpl.kpiDefinitions || {};
    const result: any = { meta: { templateId: tpl.id, start, end }, kpis: {} };

    for (const [k, def] of Object.entries(defs)) {
      // Implement a small set of known KPI computations by delegating to repo-specific queries
      if ((def as any).source === 'visits') {
        // count visits from visit table for the period
        const qb = this.reportRepo.manager.createQueryBuilder().select('COUNT(v.id)', 'value').from('visit', 'v').where('v.created_at::date >= :start AND v.created_at::date <= :end', { start, end });
        if (tpl.department) qb.andWhere('v.department = :d', { d: tpl.department });
        const raw = await qb.getRawOne();
        result.kpis[k] = Number(raw?.value || 0);
      } else if ((def as any).source === 'inventory_usage') {
        const qb = this.reportRepo.manager.createQueryBuilder().select('SUM(s.quantity)', 'value').from('stock_movement', 's').where('s.created_at::date >= :start AND s.created_at::date <= :end', { start, end });
        if (tpl.department) qb.andWhere('s.department = :d', { d: tpl.department });
        const raw = await qb.getRawOne();
        result.kpis[k] = Number(raw?.value || 0);
      } else if ((def as any).source === 'payments') {
        const qb = this.reportRepo.manager.createQueryBuilder().select('SUM(p.amount)', 'value').from('payment', 'p').where('p.created_at::date >= :start AND p.created_at::date <= :end', { start, end });
        const raw = await qb.getRawOne();
        result.kpis[k] = Number(raw?.value || 0);
      } else {
        // unsupported KPI type — store definition for manual evaluation
        result.kpis[k] = { unsupported: true, def };
      }
    }

    return result;
  }

  async fetchReport(id: string, actorRoles: string[]) {
    const r = await this.reportRepo.findOne({ where: { id }, relations: ['template'] });
    if (!r) throw new NotFoundException('report not found');

    // Business rule: only Admin/HR can view full report; others get sanitized view
    const allowed = actorRoles.includes('Admin') || actorRoles.includes('HR');
    if (!allowed) {
      // return only kpi summaries (redact detailed fields if present)
      return { id: r.id, name: r.name, department: r.department, periodStart: r.periodStart, periodEnd: r.periodEnd, type: r.type, status: r.status, payload: { meta: r.payload?.meta, kpis: r.payload?.kpis } };
    }

    return r;
  }

  async listReports(filter: { department?: string, start?: string, end?: string }) {
    const qb = this.reportRepo.createQueryBuilder('r');
    if (filter.department) qb.andWhere('r.department = :d', { d: filter.department });
    if (filter.start) qb.andWhere('r.period_start >= :start', { start: filter.start });
    if (filter.end) qb.andWhere('r.period_end <= :end', { end: filter.end });
    qb.orderBy('r.generated_at', 'DESC');
    return qb.getMany();
  }
}
