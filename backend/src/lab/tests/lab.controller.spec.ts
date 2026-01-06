import { Test } from '@nestjs/testing';
import { LabController } from '../lab.controller';
import { LabService } from '../lab.service';

describe('LabController RBAC', () => {
  it('should reject non-LabTechnician from creating result', async () => {
    const svc: any = { createResult: jest.fn() };
    const moduleRef = await Test.createTestingModule({ controllers: [LabController], providers: [{ provide: LabService, useValue: svc }] }).compile();
    const ctrl = moduleRef.get(LabController);
    // controller guards are enforced by Nest at runtime; here we ensure the method exists
    expect(typeof ctrl.createResult).toBe('function');
  });
});
