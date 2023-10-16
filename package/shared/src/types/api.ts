import { PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialWithAttestationJSON } from "@github/webauthn-json/dist/types/basic/json";

export interface RegisterStartRequest {
  mail: string;
  npub: string;
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
