import supertest from 'supertest';
import { Container } from 'typedi';
import { getConnection } from 'typeorm';
import { v4 } from 'uuid';
import { AppServer } from '../../../src/server';
import { errors } from '../../../src/utils/errors';
import { createDbConnection } from '../helper';
import { Seed } from '../seed';

const path = (id: string) => `/api/users/${id}`;
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
  describe('getUser', () => {
    it('should get a user', async () => {
      const user = seed.users[0];
      const defaultConsents = seed.userConsents.filter(uc => uc.userId === user.id);

      const response = await supertest(app)
        .get(path(user.id))
        .expect(200);

      const usr = response.body;
      expect(usr.email).toBe(user.email);
      expect(usr.id).toBe(user.id);
      expect(usr.consents).toHaveLength(defaultConsents.length);
    });

    it('should not get a user if user not found', async () => {
      const response = await supertest(app)
        .get(path(v4()))
        .expect(404);

      expect(response.body.message).toBe(errors.USER_NOT_FOUND);
    });
  });
});
