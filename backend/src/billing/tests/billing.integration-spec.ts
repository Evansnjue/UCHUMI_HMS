import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../auth/entities/user.entity';
import { Role } from '../../../auth/entities/role.entity';
import { Invoice } from '../entities/invoice.entity';
import { AuthService } from '../../../auth/auth.service';

jest.setTimeout(120000);

describe('Billing e2e (authenticated flows)', () => {
  let app: INestApplication;
  let userRepo: Repository<User>;
  let roleRepo: Repository<Role>;
  let invoiceRepo: Repository<Invoice>;
  const testUser = { email: 'acct@test.local', password: 'Acct1!', firstName: 'Acct', lastName: 'User' };
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    userRepo = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    roleRepo = moduleFixture.get<Repository<Role>>(getRepositoryToken(Role));
    invoiceRepo = moduleFixture.get<Repository<Invoice>>(getRepositoryToken(Invoice));

    const accRole = await roleRepo.findOne({ where: { name: 'Accountant' } });
    expect(accRole).toBeDefined();

    await userRepo.delete({ email: testUser.email }).catch(() => {});
    // create user via AuthService to ensure password hashing and proper role assignment
    const authService = moduleFixture.get<AuthService>(AuthService);
    await authService.register({ email: testUser.email, firstName: testUser.firstName, lastName: testUser.lastName, password: testUser.password, roles: [accRole] } as any);

    const res = await request(app.getHttpServer()).post('/auth/login').send({ email: testUser.email, password: testUser.password });
    expect([200,201]).toContain(res.status);
    authToken = res.body?.accessToken;
    expect(authToken).toBeDefined();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('creates invoice and records payments, updating status', async () => {
    // Create invoice via API
    const invoicePayload = { items: [{ description: 'Consultation', quantity: 1, unitPrice: 30 }, { description: 'Lab', quantity: 1, unitPrice: 20 }], insuranceCoveredAmount: 0 };
    const createRes = await request(app.getHttpServer()).post('/billing/invoices').set('Authorization', `Bearer ${authToken}`).send(invoicePayload);
    expect([200,201]).toContain(createRes.status);
    const invId = createRes.body?.id;
    expect(invId).toBeDefined();

    const invoice = await invoiceRepo.findOne({ where: { id: invId } });
    expect(Number(invoice.totalAmount)).toBe(50);
    expect(invoice.status).toBe('UNPAID');

    // Partial payment
    const payRes1 = await request(app.getHttpServer()).post(`/billing/invoices/${invId}/payments`).set('Authorization', `Bearer ${authToken}`).send({ amount: 20, method: 'CASH' });
    expect([200,201]).toContain(payRes1.status);

    const updated1 = await invoiceRepo.findOne({ where: { id: invId } });
    expect(updated1.status).toBe('PARTIAL');

    // Full payment remaining
    const payRes2 = await request(app.getHttpServer()).post(`/billing/invoices/${invId}/payments`).set('Authorization', `Bearer ${authToken}`).send({ amount: 30, method: 'MOBILE_MONEY' });
    expect([200,201]).toContain(payRes2.status);

    const updated2 = await invoiceRepo.findOne({ where: { id: invId } });
    expect(updated2.status).toBe('PAID');
  });
});