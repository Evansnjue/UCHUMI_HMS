import { Test } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { InventoryModule } from '../inventory.module';
describe('InventoryController (e2e) - scaffold', () => {
    let app;
    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({ imports: [InventoryModule] }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });
    it('/inventory/items (GET) should require auth', () => {
        return request(app.getHttpServer()).get('/inventory/items').expect(401);
    });
    // TODO: add authenticated flow: create SupplyManager user, seed items, perform add/remove/transfer via JWT
});
//# sourceMappingURL=inventory.controller.int-spec.js.map