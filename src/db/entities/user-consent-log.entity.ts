import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Consent } from './consent.entity';
import { User } from './user.entity';

@Entity()
export class UserConsentLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}