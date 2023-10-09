import {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialWithAttestationJSON,
} from '@github/webauthn-json/dist/types/basic/json';

export class RegisterStartDto {
  mail: string;
  npub: string;
}

export class RegisterStartResponseDto {
  id: string;
  option: PublicKeyCredentialCreationOptionsJSON;
}

export class RegisterCompleteDto {
  id: string;
  attestation: PublicKeyCredentialWithAttestationJSON;
}
