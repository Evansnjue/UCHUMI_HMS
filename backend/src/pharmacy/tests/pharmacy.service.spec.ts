import { Test } from '@nestjs/testing';
import { PharmacyService } from '../pharmacy.service';
import { getManager } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

jest.mock('typeorm', () => ({
  ...(jest.requireActual('typeorm') as any),
  getManager: jest.fn(),
}));

describe('PharmacyService - fulfillPrescription', () => {
  let svc: PharmacyService;
  const eventBus = { publish: jest.fn() };
  const prescriptionRepo: any = { findOne: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({ providers: [PharmacyService, { provide: 'EventBusService', useValue: eventBus }, { provide: 'PrescriptionRepository', useValue: prescriptionRepo }] }).compile();
    // direct instantiate with mocks by bypassing DI for simplicity
    svc = new PharmacyService(
      // dispensedRepo
      {} as any,
      // stockRepo
      {} as any,
      // prescriptionRepo
      (prescriptionRepo as any),
      // itemRepo
      {} as any,
      // limitRepo
      {} as any,
      // eventBus
      (eventBus as any),
    );
  });

  it('fulfills prescription successfully and emits events', async () => {
    const prescription = { id: 'pres1', prescribedBy: { id: 'doc1' }, items: [{ id: 'pi1', drug: { id: 'drug1' }, quantity: 2, unit: 'tab' }] } as any;
    prescriptionRepo.findOne.mockResolvedValue(prescription as any);

    const managerMock: any = {
      findByIds: jest.fn().mockResolvedValue([prescription.items[0]]),
      findOne: jest.fn().mockImplementation((entity, opts) => {
        if (entity && entity.name === 'Stock') return { id: 'stock1', drug: { id: 'drug1' }, location: 'central', quantity: 10 };
        return null;
      }),
      save: jest.fn().mockResolvedValue(true),
      create: jest.fn().mockImplementation((cls, payload) => payload),
      count: jest.fn().mockResolvedValue(0),
      query: jest.fn().mockResolvedValue(true),
    };

    // Mock getManager().transaction
    (getManager as jest.Mock).mockReturnValue({ transaction: (cb: any) => cb(managerMock) });

    const res = await svc.fulfillPrescription('pres1', [{ prescriptionItemId: 'pi1', quantity: 2 }], 'pharm1');
    expect(res).toEqual({ dispensed: 1 });
    expect(managerMock.save).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalledWith('DrugDispensed', expect.any(Object));
    expect(eventBus.publish).toHaveBeenCalledWith('StockUpdated', expect.any(Object));
  });

  it('throws on insufficient stock', async () => {
    const prescription = { id: 'pres2', prescribedBy: { id: 'doc2' }, items: [{ id: 'pi2', drug: { id: 'drug2' }, quantity: 5 }] } as any;
    prescriptionRepo.findOne.mockResolvedValue(prescription as any);

    const managerMock: any = {
      findByIds: jest.fn().mockResolvedValue([prescription.items[0]]),
      findOne: jest.fn().mockResolvedValue({ id: 'stock2', drug: { id: 'drug2' }, location: 'central', quantity: 1 }),
      save: jest.fn(),
    };
    (getManager as jest.Mock).mockReturnValue({ transaction: (cb: any) => cb(managerMock) });

    await expect(svc.fulfillPrescription('pres2', [{ prescriptionItemId: 'pi2', quantity: 5 }], 'pharm2')).rejects.toBeInstanceOf(BadRequestException);
    // Should not publish events
    expect(eventBus.publish).not.toHaveBeenCalled();
  });

  it('throws when doctor drug daily limit exceeded', async () => {
    const prescription = { id: 'pres3', prescribedBy: { id: 'doc3' }, items: [{ id: 'pi3', drug: { id: 'drug3' }, quantity: 5 }] } as any;
    prescriptionRepo.findOne.mockResolvedValue(prescription as any);

    const managerMock: any = {
      findByIds: jest.fn().mockResolvedValue([prescription.items[0]]),
      findOne: jest.fn().mockImplementation((entity, opts) => {
        // doctor limit exists
        if (entity && entity.name === 'DoctorDrugLimit') return { id: 'lim1', quantity: 3 };
        if (entity && entity.name === 'Stock') return { id: 'stock3', drug: { id: 'drug3' }, location: 'central', quantity: 10 };
        return null;
      }),
      count: jest.fn().mockResolvedValue(1), // already dispensed 1 today
      save: jest.fn(),
    };

    (getManager as jest.Mock).mockReturnValue({ transaction: (cb: any) => cb(managerMock) });

    await expect(svc.fulfillPrescription('pres3', [{ prescriptionItemId: 'pi3', quantity: 5 }], 'pharm3')).rejects.toBeInstanceOf(BadRequestException);
    expect(eventBus.publish).not.toHaveBeenCalled();
  });
});
