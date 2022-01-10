import { DeleteResult, EntityManager, EntityRepository, getManager, InsertResult, Repository } from 'typeorm';
import { UserConsent } from '../../db/entities/user-consent.entity';
import { Consent as IConsent } from './interfaces/consent.interface';

@EntityRepository(UserConsent)
export class UserConsentRepository extends Repository<UserConsent> {
  async deleteConsentsByUserId(
    userId: string,
    manager?: EntityManager,
  ): Promise<DeleteResult> {
    return (manager || getManager())
      .createQueryBuilder()
      .delete()
      .from(UserConsent)
      .where('userId = :userId', { userId })
      .execute();
  }

  async addUserConsents(
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
      .into('user_consent')
      .values(values)
      .execute();
  }
}
