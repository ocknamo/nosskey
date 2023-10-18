import { Injectable } from '@nestjs/common';
import { Fido2Lib } from 'fido2-lib';
import {
  base64urlToBuffer,
  bufferToBase64url,
} from '@github/webauthn-json/extended';
import { PublicKeyCredentialCreationOptionsJSON } from '@github/webauthn-json/dist/types/basic/json';
import { randomUUID } from 'crypto';
import { RedisService } from '../store/redis.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Fido2Credential, Mail, NostrAccount } from '../model';
import { Repository } from 'typeorm';
import {
  RegisterCompleteRequestDto,
  RegisterStartRequestDto,
} from './register.dto';

@Injectable()
export class RegisterService {
  f2l: Fido2Lib;

  // TODO: Set from config.
  rpId = 'localhost';

  constructor(
    @InjectRepository(Fido2Credential)
    private credentialsRepository: Repository<Fido2Credential>,
    @InjectRepository(Mail)
    private mailsRepository: Repository<Mail>,
    @InjectRepository(NostrAccount)
    private nostrAccountsRepository: Repository<NostrAccount>,
    private readonly redis: RedisService,
  ) {
    // TODO: Set from config.
    this.f2l = new Fido2Lib({
      timeout: 180000,
      rpId: this.rpId,
      rpName: 'nosskey',
      rpIcon:
        'https://imagedelivery.net/wyrwp3c-j0gDDUWgnE7lig/dbadf8fc-4c08-4e49-d8ea-e637d5c22400/public',
      challengeSize: 128,
      attestation: 'none',
      cryptoParams: [-7, -257],
      authenticatorAttachment: 'cross-platform',
      authenticatorRequireResidentKey: false,
    });
  }

  async registerStart(
    body: RegisterStartRequestDto,
  ): Promise<{ id: string; option: PublicKeyCredentialCreationOptionsJSON }> {
    const registerOption = await this.f2l.attestationOptions();

    // TODO: check uniqueness of the userName.
    registerOption.user.id = body.userName;
    registerOption.user.name = body.userName;
    registerOption.user.displayName = body.userName;

    const strChallenge = bufferToBase64url(registerOption.challenge);

    let account = new NostrAccount();
    account.npub = body.npub;
    account.userName = body.userName;
    account.encrptoNsec = body.encrptoNsec;

    // TODO: Use transaction.
    account = await this.nostrAccountsRepository.save(account);

    const mail = new Mail();
    mail.nostrAccountUserId = account.userId;
    mail.mail = body.email;
    mail.disabled = true;

    await this.mailsRepository.save(mail);

    const tmpId = randomUUID();

    await Promise.all([
      this.redis.setChallenge(tmpId, strChallenge),
      this.redis.setUserId(tmpId, account.userId),
    ]);

    // TODO: use convert function of webauthn-json
    const stringifyOption: PublicKeyCredentialCreationOptionsJSON = {
      ...registerOption,
      challenge: strChallenge,
    };

    return { id: tmpId, option: stringifyOption };
  }

  async registerComplete(body: RegisterCompleteRequestDto): Promise<boolean> {
    const { id, attestation } = body;
    const [challenge, userId] = await Promise.all([
      this.redis.getChallenge(id),
      this.redis.getUserId(id),
    ]);

    const rawAttestation = {
      ...attestation,
      id: base64urlToBuffer(attestation.id),
      rawId: base64urlToBuffer(attestation.id),
    };

    // TODO: set from config
    const result = await this.f2l.attestationResult(rawAttestation, {
      rpId: this.rpId,
      origin: 'http://localhost:5173',
      challenge,
      factor: 'first',
    });

    const publicKey = result.authnrData.get('credentialPublicKeyPem');
    const counter = result.authnrData.get('counter');
    const credIdBuf = result.authnrData.get('credId') as ArrayBuffer;
    const credId = bufferToBase64url(credIdBuf);

    // TODO: use transaction and remove Account and Mail when fail.
    const account = await this.nostrAccountsRepository.findOneOrFail({
      where: { userId },
    });
    account.status = 'ACTIVE';
    await this.nostrAccountsRepository.save(account);

    const mail = await this.mailsRepository.findOneOrFail({
      where: { nostrAccountUserId: userId },
    });
    mail.disabled = false;
    await this.mailsRepository.save(mail);

    const credential = new Fido2Credential();

    credential.publicKey = publicKey;
    credential.counter = counter;
    credential.nostrAccountUserId = userId;
    credential.credentialId = credId;

    await this.credentialsRepository.save(credential);

    return true;
  }
}
