import { InventoryService } from '../inventory.service';
import { getManager } from 'typeorm';
jest.mock('typeorm', () => ({ ...jest.requireActual('typeorm'), getManager: jest.fn() }));
describe('InventoryService', () => {
    let svc;
    const eventBus = { publish: jest.fn() };
    const itemsRepo = { findOne: jest.fn() };
    beforeEach(async () => {
        jest.clearAllMocks();
        svc = new InventoryService(itemsRepo, {}, {}, eventBus);
    });
    it('adds stock successfully and emits StockUpdated', async () => {
        const item = { id: 'it1', quantity: 5, department: { id: 'd1' } };
        itemsRepo.findOne.mockResolvedValue(item);
        const managerMock = {
            findOne: jest.fn().mockResolvedValue(item),
            save: jest.fn().mockResolvedValue(true),
            create: jest.fn().mockImplementation((cls, payload) => payload),
            query: jest.fn().mockResolvedValue(true),
        };
        getManager.mockReturnValue({ transaction: (cb) => cb(managerMock) });
        const res = await svc.addStock('it1', 3, 'replenish', 'user1');
        expect(res.quantity).toBeDefined();
        expect(eventBus.publish).toHaveBeenCalledWith('StockUpdated', expect.any(Object));
    });
    it('removes stock and fails on insufficient qty', async () => {
        const item = { id: 'it2', quantity: 2, department: { id: 'd1' } };
        itemsRepo.findOne.mockResolvedValue(item);
        const managerMock = {
            findOne: jest.fn().mockResolvedValue(item),
            save: jest.fn(),
            create: jest.fn().mockImplementation((cls, payload) => payload),
            query: jest.fn().mockResolvedValue(true),
        };
        getManager.mockReturnValue({ transaction: (cb) => cb(managerMock) });
        await expect(svc.removeStock('it2', 5, 'use', 'user2')).rejects.toBeTruthy();
    });
});
//# sourceMappingURL=inventory.service.spec.js.map