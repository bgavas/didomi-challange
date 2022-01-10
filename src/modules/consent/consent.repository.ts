import { EntityManager, EntityRepository, getManager, Repository } from 'typeorm';
import { Consent } from '../../db/entities/consent.entity';

@EntityRepository(Consent)
export class ConsentRepository extends Repository<Consent> {
  async getConsents(
    manager?: EntityManager,
  ): Promise<Consent[]> {
    return (manager || getManager()).find(Consent);
  }
}
