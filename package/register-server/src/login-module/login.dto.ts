import {
  PublicKeyCredentialRequestOptionsJSON,
  PublicKeyCredentialWithAssertionJSON,
} from '@github/webauthn-json/dist/types/basic/json';
import {
  LoginCompleteRequest,
  LoginCompleteResponse,
  LoginStartResponse,
} from 'shared';

export class LoginStartResponseDto implements LoginStartResponse {
  id: string;
  option: PublicKeyCredentialRequestOptionsJSON;
}

export class LoginCompleteRequestDto implements LoginCompleteRequest {
  id: string;
  assertion: PublicKeyCredentialWithAssertionJSON;
}

export class LoginCompleteResponseDto implements LoginCompleteResponse {
  encrypted: string;
}
