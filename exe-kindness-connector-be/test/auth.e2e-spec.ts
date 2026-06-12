import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupTestDB, closeTestDB } from './db-setup';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    await setupTestDB();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await closeTestDB();
  });

  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    fullName: 'Test User',
  };

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        expect(response.body.email).toBe(testUser.email);
        expect(response.body.fullName).toBe(testUser.fullName);
        // Password should be hashed, not returned plain
        expect(response.body.password).not.toBe(testUser.password);
      });
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('access_token');
        expect(response.body.user).toHaveProperty('_id');
      });
  });
});
