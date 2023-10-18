import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { NostrAccount } from './nostr-account.entity';

@Entity()
export class Mail {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Index()
  @Column('varchar', { comment: 'uuid' })
  nostrAccountUserId: string;

  @Column()
  mail: string;

  @Column({ default: false })
  disabled: boolean;
}
