import { ProcurementService } from '../procurement.service';
describe('ProcurementService - unit', () => {
    let svc;
    const supplierRepo = { create: jest.fn(), save: jest.fn(), findOne: jest.fn() };
    const poRepo = { create: jest.fn(), save: jest.fn(), findOne: jest.fn(), createQueryBuilder: jest.fn() };
    const itemRepo = { create: jest.fn(), save: jest.fn() };
    const eventBus = { publish: jest.fn() };
    beforeEach(async () => {
        jest.clearAllMocks();
        svc = new ProcurementService(supplierRepo, poRepo, itemRepo, eventBus);
    });
    it('creates supplier', async () => {
        supplierRepo.create.mockReturnValue({});
        supplierRepo.save.mockResolvedValue({ id: 's1', name: 'Sup' });
        const res = await svc.createSupplier({ name: 'Sup' });
        expect(res).toBeDefined();
    });
    it('creates purchase order and publishes event', async () => {
        supplierRepo.findOne.mockResolvedValue({ id: 's2' });
        poRepo.create.mockReturnValue({});
        poRepo.save.mockImplementation(async (p) => ({ ...p, id: 'po1' }));
        const res = await svc.createPurchaseOrder({ supplierId: 's2', items: [{ description: 'x', quantity: 2, unitPrice: 5 }] }, 'u1');
        expect(res.id).toBe('po1');
        expect(eventBus.publish).toHaveBeenCalledWith('PurchaseOrderCreated', expect.objectContaining({ purchaseOrderId: 'po1' }));
    });
});
//# sourceMappingURL=procurement.service.spec.js.map