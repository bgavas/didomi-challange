import supertest from 'supertest';
import { Container } from 'typedi';
import { getConnection } from 'typeorm';
import { User } from '../../../src/db/entities/user.entity';
import { CreateUserDto } from '../../../src/modules/user/dto/create-user.dto';
import { AppServer } from '../../../src/server';
import { errors } from '../../../src/utils/errors';
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
  describe('createUser', () => {
    it('should create a user', async () => {
      const body: CreateUserDto = {
        email: 'dummy@test.com',
      };

      const response = await supertest(app)
        .post(path())
        .send(body)
        .expect(200);

      const usr = response.body;
      expect(body.email).toBe(usr.email);
      expect(usr.consents).toHaveLength(0);

      // Check if user created
      const [user] = await Promise.all([
        User.findOne({
          ...body,
        }),
      ]);

      expect(user).toBeTruthy();
    });

    it('should not create a user if email is malformed', async () => {
      const body: CreateUserDto = {
        email: 'dummy',
      };

      const response = await supertest(app)
        .post(path())
        .send(body)
        .expect(422);

      expect(response.body.message).toBe(errors.PROVIDE_A_VALID_URL);
    });

    it('should not create a user if email already exists', async () => {
      const body: CreateUserDto = {
        email: seed.users[0].email,
      };

      const response = await supertest(app)
        .post(path())
        .send(body)
        .expect(422);

      expect(response.body.message).toBe(errors.USER_WITH_THIS_EMAIL_EXISTS);
    });
  });
});
