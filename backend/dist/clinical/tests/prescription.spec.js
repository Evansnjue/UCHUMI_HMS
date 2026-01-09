import { Test } from '@nestjs/testing';
import { ClinicalService } from '../clinical.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Consultation } from '../entities/consultation.entity';
import { Prescription } from '../entities/prescription.entity';
describe('ClinicalService - prescription limits', () => {
    it('blocks prescription exceeding daily category limit', async () => {
        const consultRepo = { findOne: jest.fn().mockResolvedValue({ id: 'c1' }) };
        const drugCategory = { id: 'cat1', name: 'Opioids', dailyLimit: 5 };
        const drug = { id: 'd1', name: 'DrugA', category: drugCategory };
        const drugRepo = { findByIds: jest.fn().mockResolvedValue([drug]) };
        // existing prescription with quantity 3
        const presRepo = { createQueryBuilder: jest.fn().mockReturnValue({ leftJoinAndSelect: jest.fn().mockReturnThis(), where: jest.fn().mockReturnThis(), andWhere: jest.fn().mockReturnThis(), getMany: jest.fn().mockResolvedValue([{ items: [{ quantity: 3 }] }]) }), save: jest.fn() };
        const itemsRepo = { create: jest.fn() };
        const catRepo = { findOne: jest.fn().mockResolvedValue(drugCategory) };
        const eventBus = { publish: jest.fn() };
        const moduleRef = await Test.createTestingModule({ providers: [ClinicalService, { provide: getRepositoryToken(Consultation), useValue: consultRepo }, { provide: getRepositoryToken(Prescription), useValue: presRepo }, { provide: getRepositoryToken('PrescriptionItem'), useValue: itemsRepo }, { provide: getRepositoryToken('Drug'), useValue: drugRepo }, { provide: getRepositoryToken('DrugCategory'), useValue: catRepo }, { provide: 'EventBusService', useValue: eventBus }] }).compile();
        const svc = moduleRef.get(ClinicalService);
        // attempt to prescribe 3 more -> total 6 exceeds daily limit 5
        await expect(svc.createPrescription({ consultationId: 'c1', items: [{ drugId: 'd1', quantity: 3 }] }, { id: 'doc1' })).rejects.toBeTruthy();
    });
});
//# sourceMappingURL=prescription.spec.js.map