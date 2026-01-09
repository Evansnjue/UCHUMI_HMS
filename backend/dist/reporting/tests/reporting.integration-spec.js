import { Test } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../auth/entities/user.entity';
import { Role } from '../../../auth/entities/role.entity';
import { AuthService } from '../../../auth/auth.service';
jest.setTimeout(120000);
describe('Reporting e2e (authenticated flows)', () => {
    let app;
    let userRepo;
    let roleRepo;
    const testUser = { email: 'reporter@test.local', password: 'Rpt1!', firstName: 'Report', lastName: 'User' };
    let authToken;
    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();
        userRepo = moduleFixture.get(getRepositoryToken(User));
        roleRepo = moduleFixture.get(getRepositoryToken(Role));
        const hrRole = await roleRepo.findOne({ where: { name: 'HR' } });
        expect(hrRole).toBeDefined();
        await userRepo.delete({ email: testUser.email }).catch(() => { });
        const authService = moduleFixture.get(AuthService);
        await authService.register({ email: testUser.email, firstName: testUser.firstName, lastName: testUser.lastName, password: testUser.password, roles: [hrRole] });
        const res = await request(app.getHttpServer()).post('/auth/login').send({ email: testUser.email, password: testUser.password });
        expect([200, 201]).toContain(res.status);
        authToken = res.body?.accessToken;
        expect(authToken).toBeDefined();
    });
    afterAll(async () => {
        if (app)
            await app.close();
    });
    it('creates template, generates report and fetches it', async () => {
        const tpl = { name: 'Daily Summary', kpiDefinitions: { patient_flow: { source: 'visits' }, revenue: { source: 'payments' } } };
        const createRes = await request(app.getHttpServer()).post('/reporting/templates').set('Authorization', `Bearer ${authToken}`).send(tpl);
        expect([200, 201]).toContain(createRes.status);
        const tplId = createRes.body?.id;
        expect(tplId).toBeDefined();
        const genRes = await request(app.getHttpServer()).post('/reporting/generate').set('Authorization', `Bearer ${authToken}`).send({ templateId: tplId, periodStart: '2026-01-01', periodEnd: '2026-01-01' });
        expect([200, 201]).toContain(genRes.status);
        const reportId = genRes.body?.id;
        expect(reportId).toBeDefined();
        const getRes = await request(app.getHttpServer()).get(`/reporting/${reportId}`).set('Authorization', `Bearer ${authToken}`);
        expect([200, 201]).toContain(getRes.status);
        expect(getRes.body.payload).toBeDefined();
    });
});
//# sourceMappingURL=reporting.integration-spec.js.map