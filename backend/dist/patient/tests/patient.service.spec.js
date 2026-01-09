import { Test } from '@nestjs/testing';
import { PatientService } from '../patient.service';
import { InMemoryEventBus } from '../../auth/event-bus/in-memory-event-bus';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Patient } from '../entities/patient.entity';
describe('PatientService (unit) - scaffold', () => {
    it('publishes PatientRegistered when creating a patient', async () => {
        const eventBus = new InMemoryEventBus();
        const moduleRef = await Test.createTestingModule({
            providers: [
                PatientService,
                { provide: InMemoryEventBus, useValue: eventBus },
                { provide: getRepositoryToken(Patient), useValue: { create: jest.fn().mockReturnValue({}), save: jest.fn().mockResolvedValue({ id: 'abc' }) } },
            ],
        }).compile();
        const svc = moduleRef.get(PatientService);
        const res = await svc.create({ firstName: 'A', lastName: 'B' });
        expect(eventBus.events.some((e) => e.name === 'PatientRegistered')).toBeTruthy();
    });
});
//# sourceMappingURL=patient.service.spec.js.map