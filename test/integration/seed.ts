import { Service } from 'typedi';
import { getConnection } from 'typeorm';
import { v4 } from 'uuid';
import { Consent } from '../../src/db/entities/consent.entity';
import { UserConsentLog } from '../../src/db/entities/user-consent-log.entity';
import { UserConsent } from '../../src/db/entities/user-consent.entity';
import { User } from '../../src/db/entities/user.entity';

@Service()
export class Seed {
  users: User[];
  consents: Consent[];
  userConsents: UserConsent[];
  userConsentLogs: UserConsentLog[];

  constructor() {
    this.consents = [
      Consent.create({
        id: 'email_notifications',
      }),
      Consent.create({
        id: 'sms_notifications',
      }),
    ];

    this.users = [
      User.create({
        id: v4(),
        email: 'john@gmail.com',
      }),
      User.create({
        id: v4(),
        email: 'may@gmail.com',
      }),
    ];

    this.userConsents = [
      UserConsent.create({
        id: v4(),
        userId: this.users[0].id,
        consentId: this.consents[0].id,
        enabled: true,
      }),
      UserConsent.create({
        id: v4(),
        userId: this.users[0].id,
        consentId: this.consents[1].id,
        enabled: false,
      }),
    ];

    this.userConsentLogs = [
      UserConsentLog.create({
        id: v4(),
        userId: this.users[0].id,
        consentId: this.consents[0].id,
        enabled: true,
      }),
      UserConsentLog.create({
        id: v4(),
        userId: this.users[0].id,
        consentId: this.consents[1].id,
        enabled: false,
      }),
    ];
  }

  async populateTables() {
    await Consent.insert(this.consents);
    await User.insert(this.users);
    await UserConsent.insert(this.userConsents);
    await UserConsentLog.insert(this.userConsentLogs);
  }

  async clearTables() {
    const connection = getConnection();
    await connection.getRepository(UserConsent).delete({});
    await connection.getRepository(UserConsentLog).delete({});
    await connection.getRepository(Consent).delete({});
    await connection.getRepository(User).delete({});
  }
}
