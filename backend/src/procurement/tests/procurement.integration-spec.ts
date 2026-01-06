import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../auth/entities/user.entity';
import { Role } from '../../../auth/entities/role.entity';
import { AuthService } from '../../../auth/auth.service';

jest.setTimeout(120000);

describe('Procurement e2e', () => {
  let app: INestApplication;
  let userRepo: Repository<User>;
  let roleRepo: Repository<Role>;
  const testUser = { email: 'supply@test.local', password: 'Supply1!', firstName: 'Supply', lastName: 'User' };
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    userRepo = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    roleRepo = moduleFixture.get<Repository<Role>>(getRepositoryToken(Role));

    const role = await roleRepo.findOne({ where: { name: 'SupplyManager' } });
    expect(role).toBeDefined();

    await userRepo.delete({ email: testUser.email }).catch(() => {});
    const authService = moduleFixture.get<AuthService>(AuthService);
    await authService.register({ email: testUser.email, firstName: testUser.firstName, lastName: testUser.lastName, password: testUser.password, roles: [role] } as any);

    const res = await request(app.getHttpServer()).post('/auth/login').send({ email: testUser.email, password: testUser.password });
    token = res.body?.accessToken;
  });

  afterAll(async () => { if (app) await app.close(); });

  it('creates supplier and purchase order, then approves it', async () => {
    const supRes = await request(app.getHttpServer()).post('/procurement/suppliers').set('Authorization', `Bearer ${token}`).send({ name: 'Acme Supplies' });
    expect([200,201]).toContain(supRes.status);
    const supplierId = supRes.body?.id;

    const poRes = await request(app.getHttpServer()).post('/procurement/purchase-orders').set('Authorization', `Bearer ${token}`).send({ supplierId, items: [{ description: 'Gauze', quantity: 10, unitPrice: 2.5 }] });
    expect([200,201]).toContain(poRes.status);
    const poId = poRes.body?.id;

    const approveRes = await request(app.getHttpServer()).put(`/procurement/purchase-orders/${poId}/approve`).set('Authorization', `Bearer ${token}`).send({ approverId: 'x' });
    expect([200,201]).toContain(approveRes.status);
    expect(approveRes.body.status).toBe('APPROVED');
  });
});