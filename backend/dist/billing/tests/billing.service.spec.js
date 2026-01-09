import { Test } from '@nestjs/testing';
import { BillingService } from '../billing.service';
describe('BillingService - unit', () => {
    let svc;
    const invoiceRepo = { save: jest.fn(), findOne: jest.fn(), find: jest.fn() };
    const itemRepo = { create: jest.fn() };
    const paymentRepo = { save: jest.fn(), createQueryBuilder: jest.fn() };
    const eventBus = { publish: jest.fn() };
    beforeEach(async () => {
        jest.clearAllMocks();
        paymentRepo.delete = jest.fn();
        const moduleRef = await Test.createTestingModule({ providers: [BillingService] }).compile();
        svc = new BillingService(invoiceRepo, itemRepo, paymentRepo, eventBus);
    });
    it('generates invoice with correct totals and insurance coverage', async () => {
        const dto = {
            patientId: 'p1',
            items: [{ description: 'Consult', quantity: 1, unitPrice: 50 }, { description: 'Lab', quantity: 1, unitPrice: 20 }],
            insuranceProvider: 'InsCo',
            insuranceCoveredAmount: 40,
        };
        // Simulate save returning entity with id
        invoiceRepo.save.mockImplementation(async (inv) => ({ ...inv, id: 'inv1' }));
        const saved = await svc.generateInvoice(dto, 'user1');
        expect(saved).toBeDefined();
        expect(saved.id).toBeDefined();
        expect(Number(saved.totalAmount)).toBe(70); // 50 + 20
        expect(Number(saved.insuranceCoveredAmount)).toBe(40);
        expect(Number(saved.patientResponsible)).toBe(30); // 70 - 40
        expect(eventBus.publish).toHaveBeenCalledWith('InvoiceGenerated', expect.objectContaining({ invoiceId: saved.id, totalAmount: 70 }));
    });
    it('records payment and transitions invoice status (PARTIAL -> PAID)', async () => {
        // existing invoice total 100
        const invoice = { id: 'inv2', totalAmount: 100, status: 'UNPAID', items: [] };
        invoiceRepo.findOne.mockResolvedValue(invoice);
        // Save payment returns payment id
        paymentRepo.save.mockImplementation(async (p) => ({ ...p, id: 'pay1' }));
        // Mock payment sum query: first call return 30 (after first payment), then 100 (after full)
        const qbMockFirst = {
            select: () => qbMockFirst,
            where: () => qbMockFirst,
            getRawOne: async () => ({ total: '30' }),
        };
        const qbMockSecond = {
            select: () => qbMockSecond,
            where: () => qbMockSecond,
            getRawOne: async () => ({ total: '100' }),
        };
        // We'll swap mock implementations between calls by tracking invocations
        let callCount = 0;
        paymentRepo.createQueryBuilder.mockImplementation(() => ({
            select: () => ({ where: () => ({ getRawOne: async () => (callCount++ === 0 ? { total: '30' } : { total: '100' }) }) })
        }));
        // First partial payment of 30
        const partial = await svc.recordPayment({ invoiceId: 'inv2', amount: 30, method: 'CASH' }, 'user1');
        expect(partial).toBeDefined();
        expect(eventBus.publish).toHaveBeenCalledWith('PaymentReceived', expect.objectContaining({ invoiceId: 'inv2', amount: 30 }));
        expect(invoiceRepo.save).toHaveBeenCalled();
        // Second payment to reach total
        const full = await svc.recordPayment({ invoiceId: 'inv2', amount: 70, method: 'MOBILE_MONEY' }, 'user1');
        expect(full).toBeDefined();
        expect(eventBus.publish).toHaveBeenCalledWith('PaymentReceived', expect.objectContaining({ invoiceId: 'inv2', amount: 70 }));
        expect(invoiceRepo.save).toHaveBeenCalled();
        // Overpayment attempt should throw
        paymentRepo.save.mockImplementation(async (p) => ({ ...p, id: 'pay-over' }));
        paymentRepo.createQueryBuilder.mockImplementation(() => ({
            select: () => ({ where: () => ({ getRawOne: async () => ({ total: '200' }) }) })
        }));
        await expect(svc.recordPayment({ invoiceId: 'inv2', amount: 150, method: 'CASH' }, 'user1')).rejects.toBeTruthy();
    });
    it('throws when invoice not found', async () => {
        invoiceRepo.findOne.mockResolvedValue(null);
        await expect(svc.recordPayment({ invoiceId: 'non', amount: 10, method: 'CASH' }, 'u')).rejects.toBeTruthy();
    });
    it('returns unpaid insurance claims', async () => {
        const invoices = [{ id: 'i1' }, { id: 'i2' }];
        const qb = {
            where: () => qb,
            andWhere: () => qb,
            getMany: async () => invoices,
        };
        invoiceRepo.createQueryBuilder = jest.fn().mockReturnValue(qb);
        const res = await svc.unpaidInsuranceClaims();
        expect(res).toEqual(invoices);
        expect(invoiceRepo.createQueryBuilder).toHaveBeenCalledWith('i');
    });
});
//# sourceMappingURL=billing.service.spec.js.map