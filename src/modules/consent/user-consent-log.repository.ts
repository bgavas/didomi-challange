import { EntityManager, EntityRepository, getManager, InsertResult, Repository } from 'typeorm';
import { UserConsentLog } from '../../db/entities/user-consent-log.entity';
import { Consent as IConsent } from './interfaces/consent.interface';

@EntityRepository(UserConsentLog)
export class UserConsentLogRepository extends Repository<UserConsentLog> {
  async addUserConsentLogs(
    userId: string,
    consents: IConsent[],
    manager?: EntityManager,
  ): Promise<InsertResult> {
    const values = consents.map(c => ({
      userId,
      consentId: c.id,
      enabled: c.enabled,
    }));

    return (manager || getManager())
      .createQueryBuilder()
      .insert()
      .into('user_consent_log')
      .values(values)
      .execute();
  }
}
