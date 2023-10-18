import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { NostrAccount } from './nostr-account.entity';

@Entity()
export class Fido2Credential {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Index()
  @Column()
  nostrAccountUserId: string;

  @Column()
  credentialId: string;

  @Column()
  publicKey: string;

  @Column()
  counter: number;

  @Column({ default: false })
  disabled: boolean;
}
