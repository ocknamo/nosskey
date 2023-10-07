import {
  create,
  parseCreationOptionsFromJSON,
} from "@github/webauthn-json/browser-ponyfill";
import type { PublicKeyCredentialCreationOptionsJSON } from "@github/webauthn-json/dist/types/basic/json";

export class Register {
  // TODO: set from config
  baseUrl = 'http://localhost:3333/';

  constructor(private readonly email: string, private readonly password: string) {}

  async registerStart(): Promise<boolean> {

    const options = await this.fetchOptions();
    // const options = parseCreationOptionsFromJSON({ publicKey: options});
    // const response = await create(options);
    create(parseCreationOptionsFromJSON({ publicKey: options}))
    // await navigator.credentials.create({ publicKey: options});

    return false;
  }

  private async fetchOptions(): Promise<PublicKeyCredentialCreationOptionsJSON> {
    // TODO: API
    const postReq = new Request(this.baseUrl + 'register-start', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          email: this.email,
          npub: 'mocknpub',
        })
    });
    const res = await (await fetch(postReq)).json();

    return res as PublicKeyCredentialCreationOptionsJSON;
  }
}