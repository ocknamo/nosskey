import { Strage } from '$lib/storage/strage';
import { WebCrypto } from '$lib/web-crypto/web-crypto';
import { create, parseCreationOptionsFromJSON } from '@github/webauthn-json/browser-ponyfill';
import type {
	PublicKeyCredentialCreationOptionsJSON,
	PublicKeyCredentialWithAttestationJSON
} from '@github/webauthn-json/dist/types/basic/json';

export class Register {
	// TODO: set from config
	baseUrl = 'http://localhost:3333/';

	registId = '';
	email = '';
	userName = '';

	constructor() {}

	async registerStart(email: string, userName: string, encryptionKey: string): Promise<boolean> {
		this.email = email;
		this.userName = userName;

		// TODO: create nsec and npub and store to strage.

		console.time('[Register] registerStart: WebCrypto.getKeyHash');
		const passHash = await WebCrypto.getKeyHash(encryptionKey);
		console.timeEnd('[Register] registerStart: WebCrypto.getKeyHash');

		const options = await this.fetchOptions();

		const res = await create(parseCreationOptionsFromJSON({ publicKey: options }));

		await this.postSign(res.toJSON());

		const strage = new Strage();

		// success
		strage.setEncryptionKey(encryptionKey);

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
