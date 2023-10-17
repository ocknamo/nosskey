import { PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialWithAttestationJSON } from "@github/webauthn-json/dist/types/basic/json";

export interface RegisterStartRequest {
  email: string;
  npub: string;
  encrptoNsec: string;
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
