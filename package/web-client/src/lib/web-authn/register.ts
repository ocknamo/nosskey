import { create, parseCreationOptionsFromJSON } from '@github/webauthn-json/browser-ponyfill';
import type {
	PublicKeyCredentialCreationOptionsJSON,
	PublicKeyCredentialWithAttestationJSON
} from '@github/webauthn-json/dist/types/basic/json';

export class Register {
	// TODO: set from config
	baseUrl = 'http://localhost:3333/';

	registId = '';

	constructor(
		private readonly email: string,
		private readonly userName: string,
		private readonly password: string
	) {}

	async registerStart(): Promise<boolean> {
		const options = await this.fetchOptions();

		const res = await create(parseCreationOptionsFromJSON({ publicKey: options }));

		await this.postSign(res.toJSON());

		return false;
	}

	private async fetchOptions(): Promise<PublicKeyCredentialCreationOptionsJSON> {
		const postReq = new Request(this.baseUrl + 'register-start', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: this.email,
				npub: 'mocknpub',
				encrptoNsec: 'mockcrptnsec',
				userName: this.userName
			})
		});
		const { id, option } = (await (await fetch(postReq)).json()) as {
			id: string;
			option: PublicKeyCredentialCreationOptionsJSON;
		};

		this.registId = id;

		return option;
	}

	private async postSign(attestation: PublicKeyCredentialWithAttestationJSON): Promise<boolean> {
		const postReq = new Request(this.baseUrl + 'register-complete', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id: this.registId,
				attestation
			})
		});

		return (await fetch(postReq)).json();
	}
}
