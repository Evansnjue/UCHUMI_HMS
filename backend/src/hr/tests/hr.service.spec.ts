import { Test } from '@nestjs/testing';
import { HRService } from '../hr.service';

describe('HRService - unit', () => {
  let svc: HRService;
  const empRepo: any = { create: jest.fn(), save: jest.fn(), findOne: jest.fn(), count: jest.fn(), createQueryBuilder: jest.fn(), find: jest.fn() };
  const attRepo: any = { create: jest.fn(), save: jest.fn(), findOne: jest.fn(), createQueryBuilder: jest.fn() };
  const payrollRepo: any = { create: jest.fn(), save: jest.fn() };
  const eventBus: any = { publish: jest.fn(), subscribe: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({ providers: [HRService] }).compile();
    svc = new HRService(empRepo, attRepo, payrollRepo, eventBus as any);
  });

  it('allocates employee numbers and creates employee', async () => {
    empRepo.count.mockResolvedValue(42);
    empRepo.findOne.mockResolvedValue(null);
    empRepo.create.mockReturnValue({});
    empRepo.save.mockResolvedValue({ id: 'e1', employeeNo: 'EMP-2026-00043' });

    const res = await svc.createEmployee({ firstName: 'E', lastName: 'X', email: 'a@b.com', role: 'Nurse', hireDate: '2026-01-01', salary: 1000 } as any);
    expect(res).toBeDefined();
    expect(res.employeeNo).toMatch(/^EMP-\d{4}-/);
  });

  it('marks late on late checkin', async () => {
    const emp = { id: 'e2' };
    empRepo.findOne.mockResolvedValue(emp);
    attRepo.create.mockImplementation((x: any) => x);
    attRepo.save.mockImplementation(async (x: any) => ({ ...x, id: 'a1' }));

    // Provide a timestamp after 09:20 UTC to exceed 15 min grace
    const ts = new Date();
    ts.setUTCHours(9, 30, 0, 0);
    const res = await svc.checkIn({ employeeId: 'e2', timestamp: ts.toISOString() } as any);
    expect(res.status).toBe('LATE');
    expect(eventBus.publish).toHaveBeenCalledWith('EmployeeCheckedIn', expect.objectContaining({ status: 'LATE' }));
  });

  it('calculates overtime on checkout', async () => {
    const emp = { id: 'e3' };
    empRepo.findOne.mockResolvedValue(emp);
    const checkIn = new Date();
    checkIn.setUTCHours(8, 0, 0, 0);
    const att = { id: 'att1', checkIn, shiftDate: checkIn.toISOString().substring(0, 10), employee: emp } as any;
    attRepo.findOne.mockResolvedValue(att);
    attRepo.save.mockImplementation(async (x: any) => x);

    // checkout at 18:00 (10 hours -> 2h overtime)
    const out = new Date();
    out.setUTCHours(18, 0, 0, 0);
    const res = await svc.checkOut({ employeeId: 'e3', timestamp: out.toISOString() } as any);
    expect(res.overtimeSeconds).toBeGreaterThan(0);
    expect(eventBus.publish).toHaveBeenCalledWith('EmployeeOvertime', expect.objectContaining({ employeeId: 'e3' }));
  });

  it('generates payroll records', async () => {
    empRepo.createQueryBuilder = jest.fn().mockReturnValue({ andWhere: () => ({ getMany: async () => [{ id: 'e4', salary: '1000' }] }) });
    attRepo.createQueryBuilder = jest.fn().mockReturnValue({ select: () => ({ where: () => ({ andWhere: () => ({ getRawOne: async () => ({ totalOvertime: '3600' }) }) }) }) });
    payrollRepo.create.mockImplementation((x: any) => x);
    payrollRepo.save.mockImplementation(async (x: any) => ({ ...x, id: 'p1' }));

    const res = await svc.generatePayroll({ periodStart: '2026-01-01', periodEnd: '2026-01-31' } as any);
    expect(res.length).toBeGreaterThanOrEqual(1);
    expect(eventBus.publish).toHaveBeenCalledWith('PayrollProcessed', expect.objectContaining({ payrollId: 'p1' }));
  });
});
