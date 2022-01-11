import supertest from 'supertest';
import { Container } from 'typedi';
import { getConnection } from 'typeorm';
import { v4 } from 'uuid';
import { User } from '../../../src/db/entities/user.entity';
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
  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const usr = seed.users[0];

      await supertest(app)
        .delete(path(usr.id))
        .expect(200);

      // Check if user created
      const [user] = await Promise.all([
        User.findOne({
          id: usr.id,
        }),
      ]);

      expect(user).toBeFalsy();
    });

    it('should not delete a user if user not found', async () => {
      const response = await supertest(app)
        .delete(path(v4()))
        .expect(404);

      expect(response.body.message).toBe(errors.USER_NOT_FOUND);
    });
  });
});
