import { HttpException, Injectable } from '@nestjs/common';
import { Fido2Lib } from 'fido2-lib';
import {
  base64urlToBuffer,
  bufferToBase64url,
} from '@github/webauthn-json/extended';
import {
  PublicKeyCredentialDescriptorJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@github/webauthn-json/dist/types/basic/json';
import { randomUUID } from 'crypto';
import { RedisService } from '../store/redis.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Fido2Credential, Mail, NostrAccount } from '../model';
import { Repository } from 'typeorm';
import { LoginCompleteRequestDto } from './login.dto';

/**
 * TODO:
 * - Lack of email authentication process.
 */
@Injectable()
export class LoginService {
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
      timeout: 18000,
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

  async loginStart(): Promise<{
    id: string;
    option: PublicKeyCredentialRequestOptionsJSON;
  }> {
    const assertionOption = await this.f2l.assertionOptions();

    const strChallenge = bufferToBase64url(assertionOption.challenge);
    const jsonAllowCredentials = assertionOption.allowCredentials
      ? assertionOption.allowCredentials.map((ac) => ({
          type: ac.type,
          id: bufferToBase64url(ac.id),
          transports:
            ac.transports as PublicKeyCredentialDescriptorJSON['transports'],
        }))
      : undefined;

    const tmpId = randomUUID();

    await this.redis.setChallenge(tmpId, strChallenge);

    // TODO: use convert function of webauthn-json
    const stringifyOption: PublicKeyCredentialRequestOptionsJSON = {
      ...assertionOption,
      allowCredentials: jsonAllowCredentials,
      challenge: strChallenge,
    };

    return { id: tmpId, option: stringifyOption };
  }

  /**
   * Validate sign and response encrypted nsec.
   * @param body
   * @returns Encrypted Nostr secret key.
   */
  async loginComplete(body: LoginCompleteRequestDto): Promise<string> {
    const { id, assertion } = body;

    const credentialId = assertion.id;

    const registedUserCredential = await this.credentialsRepository.findOne({
      where: { credentialId },
    });

    if (registedUserCredential === null) {
      throw new HttpException('Login failed.', 400);
    }

    const user = await this.nostrAccountsRepository.findOne({
      where: { userId: registedUserCredential.nostrAccountUserId },
    });

    const challenge = await this.redis.getChallenge(id);

    if (!user || !challenge) {
      throw new HttpException('Login failed.', 400);
    }

    const result = await this.f2l
      .assertionResult(
        {
          ...assertion,
          id: base64urlToBuffer(assertion.id),
          rawId: base64urlToBuffer(assertion.rawId),
          response: {
            ...assertion.response,
            userHandle: assertion.response.userHandle ?? undefined,
            authenticatorData: base64urlToBuffer(
              assertion.response.authenticatorData,
            ),
          },
        },
        {
          challenge,
          origin: 'http://localhost:5173',
          factor: 'either',
          publicKey: registedUserCredential.publicKey,
          prevCounter: registedUserCredential.counter,
          userHandle: btoa(user.userName),
        },
      )
      .catch((error) => {
        console.error(error);
        throw new HttpException('Login failed.', 400);
      });

    // Update counter
    const counter = result.authnrData.get('counter');

    if (typeof counter !== 'number') {
      console.error('Invalid counter', counter);
      throw new HttpException('Login failed.', 400);
    }

    if (counter > 0) {
      this.credentialsRepository.save({ ...registedUserCredential, counter });
    }

    return user.encryptNsec;
  }
}
