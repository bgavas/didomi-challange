import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserConsent } from './user-consent.entity';

@Entity()
export class Consent extends BaseEntity {
  @PrimaryColumn('varchar')
  id: string;

  @OneToMany(_ => UserConsent, c => c.consent)
  consents: UserConsent[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
