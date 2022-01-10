import supertest from 'supertest';
import { Container } from 'typedi';
import { getConnection } from 'typeorm';
import { User } from '../../../src/db/entities/user.entity';
import { AppServer } from '../../../src/server';
import { createDbConnection } from '../helper';
import { Seed } from '../seed';

const path = () => '/api/users';
let seed: Seed;
let appServer: AppServer;
let app: Express.Application;

beforeAll(async () => {
  await createDbConnection();
  seed = Container.get(Seed);
  appServer = Container.get(AppServer);
  app = appServer.getApp();
});

afterAll(async () => {
  await getConnection().close();
  appServer.getServer().close();
});

beforeEach(async () => {
  await seed.clearTables();
  await seed.populateTables();
});

describe('User', () => {
  describe('getUsers', () => {
    it('should get all users', async () => {
      const seedUsers = seed.users;

      const response = await supertest(app)
        .get(path())
        .expect(200);

      const users = response.body;

      // Check lengths
      expect(users).toHaveLength(seedUsers.length);
      // Check each user id
      seedUsers.forEach((su) => {
        const match = users.find((u: User) => u.id === su.id);
        expect(match).toBeTruthy();
      });
    });
  });
});
