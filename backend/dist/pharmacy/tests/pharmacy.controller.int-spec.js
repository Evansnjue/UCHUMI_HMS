import { Test } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PharmacyModule } from '../pharmacy.module';
describe('PharmacyController (e2e) - scaffold', () => {
    let app;
    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({ imports: [PharmacyModule] }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });
    it('/pharmacy/prescriptions (GET) should require auth', () => {
        return request(app.getHttpServer()).get('/pharmacy/prescriptions').expect(401);
    });
    // TODO: Add authenticated flows: seed a Pharmacist user, login to obtain JWT, post a prescription to DB and fulfill it
});
//# sourceMappingURL=pharmacy.controller.int-spec.js.map