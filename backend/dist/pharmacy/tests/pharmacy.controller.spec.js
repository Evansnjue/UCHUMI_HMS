import { Test } from '@nestjs/testing';
import { PharmacyController } from '../pharmacy.controller';
describe('PharmacyController', () => {
    it('should be defined', async () => {
        const moduleRef = await Test.createTestingModule({ controllers: [PharmacyController] }).compile();
        const ctrl = moduleRef.get(PharmacyController);
        expect(ctrl).toBeDefined();
    });
    // TODO: add integration tests with authentication & real DB using docker-compose.test.yml
});
//# sourceMappingURL=pharmacy.controller.spec.js.map