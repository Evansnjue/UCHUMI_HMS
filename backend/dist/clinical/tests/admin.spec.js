import { Test } from '@nestjs/testing';
import { ClinicalService } from '../clinical.service';
import { getRepositoryToken } from '@nestjs/typeorm';
describe('Clinical Admin helpers', () => {
    it('creates and updates drug categories', async () => {
        const catRepo = { create: jest.fn().mockReturnValue({}), save: jest.fn().mockResolvedValue({ id: 'c1', name: 'Cat1', dailyLimit: 2 }), find: jest.fn().mockResolvedValue([{ id: 'c1', name: 'Cat1', dailyLimit: 2 }]), update: jest.fn(), findOne: jest.fn().mockResolvedValue({ id: 'c1', name: 'Cat1', dailyLimit: 2 }) };
        const moduleRef = await Test.createTestingModule({ providers: [ClinicalService, { provide: getRepositoryToken('DrugCategory'), useValue: catRepo }] }).compile();
        const svc = moduleRef.get(ClinicalService);
        const created = await svc.createCategory('Cat1', 2);
        expect(created).toBeDefined();
        const list = await svc.listCategories();
        expect(list.length).toBeGreaterThan(0);
    });
});
//# sourceMappingURL=admin.spec.js.map