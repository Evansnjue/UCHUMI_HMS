import { Test } from '@nestjs/testing';
import { ReportingService } from '../reporting.service';

describe('ReportingService - unit', () => {
  let svc: ReportingService;
  const reportRepo: any = { create: jest.fn(), save: jest.fn(), findOne: jest.fn(), createQueryBuilder: jest.fn(), find: jest.fn() };
  const tplRepo: any = { create: jest.fn(), save: jest.fn(), findOne: jest.fn(), createQueryBuilder: jest.fn() };
  const eventBus: any = { publish: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    svc = new ReportingService(reportRepo, tplRepo, eventBus as any);
  });

  it('creates a template', async () => {
    tplRepo.create.mockReturnValue({});
    tplRepo.save.mockResolvedValue({ id: 't1', name: 'Daily KPIs' });

    const res = await svc.createTemplate({ name: 'Daily KPIs', kpiDefinitions: {} } as any, 'u1');
    expect(res).toBeDefined();
  });

  it('generates a report and publishes event', async () => {
    const tpl = { id: 't2', name: 'R', kpiDefinitions: { a: { source: 'visits' } }, department: null } as any;
    tplRepo.findOne.mockResolvedValue(tpl);
    reportRepo.create.mockReturnValue({});
    reportRepo.save.mockImplementation(async (r: any) => ({ ...r, id: 'r1' }));
    // stub query manager for visit count
    const manager = { createQueryBuilder: jest.fn().mockReturnValue({ select: () => ({ from: () => ({ where: () => ({ getRawOne: async () => ({ value: '5' }) }) }) }) }) };
    reportRepo.manager = manager;

    const res = await svc.generateReport({ templateId: 't2', periodStart: '2026-01-01', periodEnd: '2026-01-01' } as any, 'u1');
    expect(res.id).toBe('r1');
    expect(eventBus.publish).toHaveBeenCalledWith('ReportGenerated', expect.objectContaining({ reportId: 'r1' }));
  });
});
