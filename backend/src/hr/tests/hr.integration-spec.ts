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

describe('HR e2e (authenticated flows)', () => {
  let app: INestApplication;
  let userRepo: Repository<User>;
  let roleRepo: Repository<Role>;
  const testUser = { email: 'hr@test.local', password: 'Hr1!', firstName: 'HR', lastName: 'User' };
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    userRepo = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    roleRepo = moduleFixture.get<Repository<Role>>(getRepositoryToken(Role));

    const hrRole = await roleRepo.findOne({ where: { name: 'HR' } });
    expect(hrRole).toBeDefined();

    await userRepo.delete({ email: testUser.email }).catch(() => {});
    const authService = moduleFixture.get<AuthService>(AuthService);
    await authService.register({ email: testUser.email, firstName: testUser.firstName, lastName: testUser.lastName, password: testUser.password, roles: [hrRole] } as any);

    const res = await request(app.getHttpServer()).post('/auth/login').send({ email: testUser.email, password: testUser.password });
    expect([200,201]).toContain(res.status);
    authToken = res.body?.accessToken;
    expect(authToken).toBeDefined();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('creates employee, checkin/checkout and generates payroll', async () => {
    const employeePayload = { firstName: 'Jane', lastName: 'Doe', email: 'jane.hr@test.local', role: 'Nurse', hireDate: '2025-12-01', salary: 1200 };
    const createRes = await request(app.getHttpServer()).post('/hr/employees').set('Authorization', `Bearer ${authToken}`).send(employeePayload);
    expect([200,201]).toContain(createRes.status);
    const empId = createRes.body?.id;
    expect(empId).toBeDefined();

    // Checkin
    const checkInRes = await request(app.getHttpServer()).post('/hr/attendance/checkin').set('Authorization', `Bearer ${authToken}`).send({ employeeId: empId });
    expect([200,201]).toContain(checkInRes.status);

    // Checkout (simulate overtime by providing past time)
    const now = new Date();
    now.setUTCHours(now.getUTCHours() + 10);
    const checkOutRes = await request(app.getHttpServer()).post('/hr/attendance/checkout').set('Authorization', `Bearer ${authToken}`).send({ employeeId: empId, timestamp: now.toISOString() });
    expect([200,201]).toContain(checkOutRes.status);

    // Generate payroll
    const payRes = await request(app.getHttpServer()).post('/hr/payroll/generate').set('Authorization', `Bearer ${authToken}`).send({ periodStart: '2026-01-01', periodEnd: '2026-01-31' });
    expect([200,201]).toContain(payRes.status);
    expect(Array.isArray(payRes.body)).toBeTruthy();
  });
});
