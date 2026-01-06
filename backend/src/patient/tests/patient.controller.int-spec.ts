import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PatientModule } from '../patient.module';

describe('PatientController (e2e) - scaffold', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PatientModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/patients (POST) should validate body', () => {
    return request(app.getHttpServer()).post('/patients').send({ firstName: '', lastName: '' }).expect(400);
  });

  it('/patients (POST) without auth should return 401', () => {
    return request(app.getHttpServer()).post('/patients').send({ firstName: 'A', lastName: 'B' }).expect(401);
  });

  it('/patients (GET) without auth should return 401', () => {
    return request(app.getHttpServer()).get('/patients').expect(401);
  });
});
