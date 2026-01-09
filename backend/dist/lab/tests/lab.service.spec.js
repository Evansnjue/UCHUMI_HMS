import { Test } from '@nestjs/testing';
import { LabService } from '../lab.service';
import { getRepositoryToken } from '@nestjs/typeorm';
describe('LabService', () => {
    it('creates lab result and emits events', async () => {
        const mockReqRepo = { findOne: jest.fn().mockResolvedValue({ id: 'lr1' }) };
        const mockTestRepo = { findOne: jest.fn().mockResolvedValue({ id: 't1' }) };
        const mockResRepo = { create: jest.fn().mockReturnValue({}), save: jest.fn().mockResolvedValue({ id: 'r1' }), find: jest.fn().mockResolvedValue([]) };
        const eventBus = { publish: jest.fn() };
        const moduleRef = await Test.createTestingModule({ providers: [LabService, { provide: getRepositoryToken('LabRequest'), useValue: mockReqRepo }, { provide: getRepositoryToken('TestCatalog'), useValue: mockTestRepo }, { provide: getRepositoryToken('LabResult'), useValue: mockResRepo }, { provide: 'EventBusService', useValue: eventBus }] }).compile();
        const svc = moduleRef.get(LabService);
        const res = await svc.createResult({ labRequestId: 'lr1', testId: 't1', value: 'Positive' }, { sub: 'user1' });
        expect(res).toBeDefined();
        expect(eventBus.publish).toHaveBeenCalled();
    });
});
//# sourceMappingURL=lab.service.spec.js.map