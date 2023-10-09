import { Injectable } from '@nestjs/common';
import { RegisterCompleteDto, RegisterStartDto } from './app.dto';
import { Fido2Lib } from 'fido2-lib';
import {
  base64urlToBuffer,
  bufferToBase64url,
} from '@github/webauthn-json/extended';
import { PublicKeyCredentialCreationOptionsJSON } from '@github/webauthn-json/dist/types/basic/json';
import { randomUUID } from 'crypto';
import { RedisService } from './store/redis.service';

@Injectable()
export class AppService {
  f2l: Fido2Lib;

  // TODO: Set from config.
  rpId = 'localhost';

  constructor(private readonly redis: RedisService) {
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
    body: RegisterStartDto,
  ): Promise<{ id: string; option: PublicKeyCredentialCreationOptionsJSON }> {
    const registerOption = await this.f2l.attestationOptions();

    // FIXME
    // should be base64url string
    registerOption.user.id = body.npub;
    registerOption.user.name = body.npub;
    registerOption.user.displayName = body.npub;

    const strChallenge = bufferToBase64url(registerOption.challenge);

    const tmpId = randomUUID();

    await this.redis.setChallenge(tmpId, strChallenge);

    // TODO: use convert function of webauthn-json
    const stringifyOption = { ...registerOption, challenge: strChallenge };

    return { id: tmpId, option: stringifyOption };
  }

  async registerComplete(body: RegisterCompleteDto): Promise<boolean> {
    const { id, attestation } = body;

    const challenge = await this.redis.getChallenge(id);

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

    // TODO: save publicKey and counter from regResult to user's info for future authentication calls into db
    console.log('Fido2AttestationResult');
    console.log(result);

    return true;
  }
}
