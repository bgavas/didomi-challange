import _ from 'lodash';
import { Service } from 'typedi';
import { EntityManager, getConnection, getCustomRepository } from 'typeorm';
import { User } from '../../db/entities/user.entity';
import { ConsentRepository } from './consent.repository';
import { Consent as IConsent } from './interfaces/consent.interface';
import { UserConsentLogRepository } from './user-consent-log.repository';
import { UserConsentRepository } from './user-consent.repository';

@Service()
export class ConsentService {
  private consentRepository = getCustomRepository(ConsentRepository);
  private userConsentRepository = getCustomRepository(UserConsentRepository);
  private userConsentLogRepository = getCustomRepository(UserConsentLogRepository);

  async updateUserConsents(
    user: User,
    consents: IConsent[],
  ): Promise<void> {
    // Start transaction
    return getConnection().transaction(async (manager) => {
      // Find valid consents.
      // This function is useful in the case of wrong consents are sent to backend.
      const validConsents = await this.extractValidConsents(consents, manager);

      // Delete old consents
      await this.userConsentRepository.deleteConsentsByUserId(user.id, manager);

      await Promise.all([
        // Add new consents
        this.userConsentRepository.addUserConsents(user.id, validConsents, manager),
        // Add consent logs
        this.userConsentLogRepository.addUserConsentLogs(user.id, validConsents, manager),
      ]);
    });
  }

  // This function extracts valid consents from a given consent array
  async extractValidConsents(
    consents: IConsent[],
    manager?: EntityManager,
  ): Promise<IConsent[]> {
    const allConsents = await this.consentRepository.getConsents(manager);

    // Filter
    const validConsents = consents.filter(c =>
      allConsents.some(ac => ac.id === c.id),
    );
    // Get unique
    const uniqueConsents = _.uniqBy(validConsents, 'id');

    // Return valid consents
    return uniqueConsents;
  }
}
