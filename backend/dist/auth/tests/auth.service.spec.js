import { Test } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
describe('AuthService (unit)', () => {
    let service;
    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: getRepositoryToken(User), useValue: { findOne: jest.fn() } },
                { provide: 'JwtService', useValue: { sign: jest.fn().mockReturnValue('token') } },
                { provide: 'EventBusService', useValue: { publish: jest.fn() } },
            ],
        }).compile();
        service = moduleRef.get(AuthService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=auth.service.spec.js.map