import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupTestDB, closeTestDB } from './db-setup';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    await setupTestDB();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Create a user and get token
    const testUser = {
      email: 'user@example.com',
      password: 'password123',
      fullName: 'User Test',
    };

    await request(app.getHttpServer()).post('/auth/register').send(testUser);
    const loginRes = await request(app.getHttpServer()).post('/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });
    accessToken = loginRes.body.access_token;
  });

  afterAll(async () => {
    await app.close();
    await closeTestDB();
  });

  it('/user/me (GET)', () => {
    return request(app.getHttpServer())
      .get('/user/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('email', 'user@example.com');
      });
  });
});
