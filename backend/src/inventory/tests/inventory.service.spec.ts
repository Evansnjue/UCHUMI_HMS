import { Test } from '@nestjs/testing';
import { InventoryService } from '../inventory.service';
import { getManager } from 'typeorm';

jest.mock('typeorm', () => ({ ...(jest.requireActual('typeorm') as any), getManager: jest.fn() }));

describe('InventoryService', () => {
  let svc: InventoryService;
  const eventBus = { publish: jest.fn() };
  const itemsRepo: any = { findOne: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    svc = new InventoryService(itemsRepo as any, {} as any, {} as any, (eventBus as any));
  });

  it('adds stock successfully and emits StockUpdated', async () => {
    const item = { id: 'it1', quantity: 5, department: { id: 'd1' } } as any;
    itemsRepo.findOne.mockResolvedValue(item);
    const managerMock: any = {
      findOne: jest.fn().mockResolvedValue(item),
      save: jest.fn().mockResolvedValue(true),
      create: jest.fn().mockImplementation((cls, payload) => payload),
      query: jest.fn().mockResolvedValue(true),
    };
    (getManager as jest.Mock).mockReturnValue({ transaction: (cb: any) => cb(managerMock) });

    const res = await svc.addStock('it1', 3, 'replenish', 'user1');
    expect(res.quantity).toBeDefined();
    expect(eventBus.publish).toHaveBeenCalledWith('StockUpdated', expect.any(Object));
  });

  it('removes stock and fails on insufficient qty', async () => {
    const item = { id: 'it2', quantity: 2, department: { id: 'd1' } } as any;
    itemsRepo.findOne.mockResolvedValue(item);
    const managerMock: any = {
      findOne: jest.fn().mockResolvedValue(item),
      save: jest.fn(),
      create: jest.fn().mockImplementation((cls, payload) => payload),
      query: jest.fn().mockResolvedValue(true),
    };
    (getManager as jest.Mock).mockReturnValue({ transaction: (cb: any) => cb(managerMock) });

    await expect(svc.removeStock('it2', 5, 'use', 'user2')).rejects.toBeTruthy();
  });
});