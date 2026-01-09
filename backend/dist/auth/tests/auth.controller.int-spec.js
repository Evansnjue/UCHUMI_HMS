import { Test } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../auth.module';
describe('AuthController (e2e) - scaffold', () => {
    let app;
    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AuthModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });
    it('/auth/login (POST) should validate body', () => {
        return request(app.getHttpServer()).post('/auth/login').send({ email: 'notanemail', password: 'x' }).expect(400);
    });
});
//# sourceMappingURL=auth.controller.int-spec.js.map