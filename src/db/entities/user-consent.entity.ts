import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Consent } from './consent.entity';
import { User } from './user.entity';

@Entity()
export class UserConsent extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  enabled: boolean;

  @ManyToOne(_ => User, user => user.consents, { onDelete: 'CASCADE' })
  user: User;

  @Index()
  @Column()
  userId: number;

  @ManyToOne(_ => Consent, consent => consent.consents, { onDelete: 'CASCADE' })
  consent: Consent;

  @Index()
  @Column()
  consentId: number;
}
