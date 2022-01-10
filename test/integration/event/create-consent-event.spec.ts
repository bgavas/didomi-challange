import supertest from 'supertest';
import { Container } from 'typedi';
import { getConnection, In } from 'typeorm';
import { v4 } from 'uuid';
import { UserConsentLog } from '../../../src/db/entities/user-consent-log.entity';
import { UserConsent } from '../../../src/db/entities/user-consent.entity';
import { CreateConsentEventDto } from '../../../src/modules/event/dto/create-consent-event.dto';
import { AppServer } from '../../../src/server';
import { errors } from '../../../src/utils/errors';
import { createDbConnection } from '../helper';
import { Seed } from '../seed';

const path = () => '/api/events/consents';
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

describe('Event', () => {
  describe('createConsentEvent', () => {
    it('should delete old consents and save new ones', async () => {
      const seedUser = seed.users[0];
      const seedLogs = seed.userConsentLogs.filter(ucl => ucl.userId === seedUser.id);

      const body: CreateConsentEventDto = {
        userId: seedUser.id,
        consents: [{
          enabled: true,
          id: 'sms_notifications',
        }],
      };

      // Expect that user has default consents
      const defaultConsents = seed.userConsents.filter(uc => uc.userId === seedUser.id);
      expect(defaultConsents.length).toBeGreaterThan(0);

      const response = await supertest(app)
        .post(path())
        .send(body)
        .expect(200);

      const usr = response.body;
      expect(usr.consents[0].consentId).toBe('sms_notifications');
      expect(usr.consents[0].enabled).toBe(true);
      expect(usr.consents).toHaveLength(body.consents.length);

      const [oldConsents, newConsent, newConsentLogs] = await Promise.all([
        // Check if old consents are deleted
        UserConsent.find({
          userId: seedUser.id,
          consentId: In(defaultConsents.map(dc => dc.id)),
        }),
        // Check if new consents are inserted
        UserConsent.findOne({
          userId: seedUser.id,
          consentId: body.consents[0].id,
          enabled: body.consents[0].enabled,
        }),
        // Check if new consent logs are inserted
        UserConsentLog.find({
          userId: seedUser.id,
        }),
      ]);

      expect(oldConsents).toHaveLength(0);
      expect(newConsent).toBeTruthy();
      expect(newConsentLogs.length).toBe(seedLogs.length + body.consents.length);
    });

    it('should not update events if user not found', async () => {
      const body: CreateConsentEventDto = {
        userId: v4(),
        consents: [{
          enabled: true,
          id: 'sms_notifications',
        }],
      };

      const response = await supertest(app)
        .post(path())
        .send(body)
        .expect(404);

      expect(response.body.message).toBe(errors.USER_NOT_FOUND);
    });
  });
});
