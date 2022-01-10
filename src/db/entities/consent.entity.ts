import {
  BaseEntity,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { UserConsent } from './user-consent.entity';

@Entity()
export class Consent extends BaseEntity {
  @PrimaryColumn('varchar')
  id: string;

  @OneToMany(_ => UserConsent, c => c.consent)
  consents: UserConsent[];
}
