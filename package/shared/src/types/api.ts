import { PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialRequestOptionsJSON, PublicKeyCredentialWithAssertionJSON, PublicKeyCredentialWithAttestationJSON } from "@github/webauthn-json/dist/types/basic/json";

export interface RegisterStartRequest {
  email: string;
  npub: string;
  encryptNsec: string;
  userName: string;
}

export interface RegisterStartResponse {
  id: string;
  option: PublicKeyCredentialCreationOptionsJSON;
}

export interface RegisterCompleteRequest {
  id: string;
  attestation: PublicKeyCredentialWithAttestationJSON;
}


export interface LoginStartResponse {
  id: string;
  option: PublicKeyCredentialRequestOptionsJSON;
};

export interface LoginCompleteRequest {
  id: string;
  assertion: PublicKeyCredentialWithAssertionJSON;
}

export interface LoginCompleteResponse {
  encrypted: string;
}