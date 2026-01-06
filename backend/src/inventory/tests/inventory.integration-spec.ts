import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../auth/entities/user.entity';
import { Role } from '../../../auth/entities/role.entity';
import { Department } from '../entities/department.entity';
import { InventoryItem } from '../entities/inventory-item.entity';
import { AuthService } from '../../../auth/auth.service';

jest.setTimeout(120000);

describe('Inventory e2e (authenticated flows)', () => {
  let app: INestApplication;
  let userRepo: Repository<User>;
  let roleRepo: Repository<Role>;
  let deptRepo: Repository<Department>;
  let itemRepo: Repository<InventoryItem>;

  const testUser = { email: 'supply@test.local', password: 'Suppl1y!', firstName: 'Supply', lastName: 'User' };
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    userRepo = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    roleRepo = moduleFixture.get<Repository<Role>>(getRepositoryToken(Role));
    deptRepo = moduleFixture.get<Repository<Department>>(getRepositoryToken(Department));
    itemRepo = moduleFixture.get<Repository<InventoryItem>>(getRepositoryToken(InventoryItem));

    // Ensure role exists (use Admin as authorized role)
    const adminRole = await roleRepo.findOne({ where: { name: 'Admin' } });
    expect(adminRole).toBeDefined();

    // Create test user (clean up existing)
    await userRepo.delete({ email: testUser.email }).catch(() => {});
    // create user via AuthService to ensure password hashing and proper role assignment
    const authService = moduleFixture.get<AuthService>(AuthService);
    await authService.register({ email: testUser.email, firstName: testUser.firstName, lastName: testUser.lastName, password: testUser.password, roles: [adminRole] } as any);

    // Login via auth endpoint
    const res = await request(app.getHttpServer()).post('/auth/login').send({ email: testUser.email, password: testUser.password });
    expect(res.status).toBe(201 || 200);
    authToken = res.body?.accessToken;
    expect(authToken).toBeDefined();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('adds stock successfully', async () => {
    // Create department and item
    const dept = deptRepo.create({ name: 'TestDept' + Date.now(), description: 'Test' } as any);
    await deptRepo.save(dept);
    const item = itemRepo.create({ name: 'TestItem', sku: 'TI-1', quantity: 0, department: dept } as any);
    await itemRepo.save(item);

    const res = await request(app.getHttpServer())
      .post('/inventory/items/add')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ itemId: item.id, quantity: 10, reason: 'restock' });

    expect(res.status).toBe(201 || 200);
    const updated = await itemRepo.findOne({ where: { id: item.id } });
    expect(Number(updated.quantity)).toBe(10);
  });

  it('removes stock and returns error on insufficient quantity', async () => {
    // Use existing item from previous test
    const item = (await itemRepo.findOne({ where: {} })) as any;
    const res = await request(app.getHttpServer())
      .post('/inventory/items/remove')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ itemId: item.id, quantity: 5, reason: 'dispense' });
    expect(res.status).toBe(201 || 200);

    // Now try to remove too much
    const res2 = await request(app.getHttpServer())
      .post('/inventory/items/remove')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ itemId: item.id, quantity: 1000, reason: 'over' });
    expect(res2.status).toBe(400);
  });

  it('transfers stock between departments', async () => {
    const source = await itemRepo.findOne({ where: {} });
    const destDept = deptRepo.create({ name: 'DestDept' + Date.now(), description: 'Dest' } as any);
    await deptRepo.save(destDept);

    const res = await request(app.getHttpServer())
      .post('/inventory/items/transfer')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ itemId: source.id, toDepartmentId: destDept.id, quantity: 2, reason: 'transfer' });
    expect(res.status).toBe(201 || 200);

    const updatedSource = await itemRepo.findOne({ where: { id: source.id } });
    expect(Number(updatedSource.quantity)).toBeLessThanOrEqual(Number(source.quantity));

    const dest = await itemRepo.findOne({ where: { name: source.name, batch: source.batch, department: { id: destDept.id } } } as any);
    expect(dest).toBeDefined();
    expect(Number(dest.quantity)).toBeGreaterThanOrEqual(2);
  });

  it('enforces RBAC for non-admin users', async () => {
    // create a user with Pharmacist role only using AuthService
    const pharmRole = await roleRepo.findOne({ where: { name: 'Pharmacist' } });
    await authService.register({ email: 'pharm@test.local', firstName: 'Pharm', lastName: 'T', password: 'Pharm1', roles: [pharmRole] } as any);
    const login = await request(app.getHttpServer()).post('/auth/login').send({ email: 'pharm@test.local', password: 'Pharm1' });
    const token = login.body?.accessToken;
    expect(token).toBeDefined();

    const res = await request(app.getHttpServer())
      .post('/inventory/items/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ itemId: (await itemRepo.findOne({ where: {} })).id, quantity: 1, reason: 'test' });

    // Pharmacist role should NOT be allowed to add stock (only Admin/SupplyManager)
    expect(res.status).toBe(403);
  });
});