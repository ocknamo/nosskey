import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Generated,
  Index,
} from 'typeorm';
import { Mail } from './mail.entity';
import { Fido2Credential } from './fido2-credential.entity';

@Entity()
export class NostrAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column('varchar', {
    length: 255,
    comment: 'user uuid',
  })
  @Generated('uuid')
  userId: string;

  @Column('varchar', {
    unique: true,
    comment: 'this is username for passkey. You can not update this.',
  })
  userName: string;

  @Column('varchar')
  npub: string;

  @Column({ default: '' })
  encrptoNsec: string;

  @Column({ default: 'INIT', comment: 'INIT or ACTIVE or INACTIVE' })
  status: string;

  @OneToMany((type) => Mail, (mail) => mail.nostrAccount)
  readonly mails: Mail[];

  @OneToMany(
    (type) => Fido2Credential,
    (fido2Credential) => fido2Credential.nostrAccount,
  )
  readonly fido2Credentials: Fido2Credential[];
}
