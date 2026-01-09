import { Test } from '@nestjs/testing';
import { VisitService } from '../visit.service';
import { InMemoryEventBus } from '../../auth/event-bus/in-memory-event-bus';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Visit } from '../entities/visit.entity';
describe('VisitService (unit) - scaffold', () => {
    it('creates visit and publishes VisitCreated', async () => {
        const eventBus = new InMemoryEventBus();
        const mockPatientRepo = { findOne: jest.fn().mockResolvedValue({ id: 'p1' }) };
        const mockDeptRepo = { findOne: jest.fn().mockResolvedValue({ id: 'd1', code: 'GEN' }) };
        const mockVisitRepo = { create: jest.fn().mockReturnValue({}), save: jest.fn().mockResolvedValue({ id: 'v1' }), findOne: jest.fn().mockResolvedValue(null) };
        const mockStatusRepo = { findOne: jest.fn().mockResolvedValue({ id: 's1', name: 'QUEUED' }) };
        const mockQueueRepo = { save: jest.fn() };
        const moduleRef = await Test.createTestingModule({ providers: [VisitService, { provide: getRepositoryToken(Visit), useValue: mockVisitRepo }, { provide: getRepositoryToken('VisitStatus'), useValue: mockStatusRepo }, { provide: getRepositoryToken('QueueEntry'), useValue: mockQueueRepo }, { provide: getRepositoryToken('Patient'), useValue: mockPatientRepo }, { provide: getRepositoryToken('Department'), useValue: mockDeptRepo }, { provide: InMemoryEventBus, useValue: eventBus }] }).compile();
        const svc = moduleRef.get(VisitService);
        const res = await svc.create({ patientId: 'p1', departmentCode: 'GEN' });
        expect(eventBus.events.some(e => e.name === 'VisitCreated')).toBeTruthy();
    });
});
//# sourceMappingURL=visit.service.spec.js.map