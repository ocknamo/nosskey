import { Injectable } from '@nestjs/common';
import { RegisterStartDto } from './app.dto';
import { Fido2Lib } from 'fido2-lib';
import { bufferToBase64url } from '@github/webauthn-json/extended';
import { PublicKeyCredentialCreationOptionsJSON } from '@github/webauthn-json/dist/types/basic/json';


@Injectable()
export class AppService {
  f2l: Fido2Lib;

  constructor() {
    // TODO: Set from config.
    this.f2l = new Fido2Lib({
      timeout: 180,
      rpId: "localhost",
      rpName: "nosskey",
      rpIcon: "https://imagedelivery.net/wyrwp3c-j0gDDUWgnE7lig/dbadf8fc-4c08-4e49-d8ea-e637d5c22400/public",
      challengeSize: 128,
      attestation: "none",
      cryptoParams: [-7, -257],
      authenticatorAttachment: "platform",
      authenticatorRequireResidentKey: false,
    });
  }

  async registerStart(body: RegisterStartDto): Promise<PublicKeyCredentialCreationOptionsJSON> {

    const registerOption = await this.f2l.attestationOptions();

    // FIXME
    // should be base64url string 
    registerOption.user.id = body.npub;
    registerOption.user.name = body.npub;
    registerOption.user.displayName = body.npub;

    // TODO: use convert function of webauthn-json
    const stringifyOption = { ...registerOption, challenge: bufferToBase64url(registerOption.challenge) };
    
    return stringifyOption;
  }
}
