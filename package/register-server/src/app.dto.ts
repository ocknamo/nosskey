import {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialWithAttestationJSON,
} from '@github/webauthn-json/dist/types/basic/json';
import {
  RegisterCompleteRequest,
  RegisterStartRequest,
  RegisterStartResponse,
} from 'shared';

export class RegisterStartRequestDto implements RegisterStartRequest {
  mail: string;
  npub: string;
  userName: string;
}

export class RegisterStartResponseDto implements RegisterStartResponse {
  id: string;
  option: PublicKeyCredentialCreationOptionsJSON;
}

export class RegisterCompleteRequestDto implements RegisterCompleteRequest {
  id: string;
  attestation: PublicKeyCredentialWithAttestationJSON;
}
