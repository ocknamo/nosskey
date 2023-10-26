import { EncryptionKeyService } from '$lib/encryption-key-service/encryption-key.service';
import { Strage } from '$lib/storage/strage';
import { WebCrypto } from '$lib/web-crypto/web-crypto';
import { create, parseCreationOptionsFromJSON } from '@github/webauthn-json/browser-ponyfill';
import type {
	PublicKeyCredentialCreationOptionsJSON,
	PublicKeyCredentialWithAttestationJSON
} from '@github/webauthn-json/dist/types/basic/json';
import { generatePrivateKey, getPublicKey, nip19 } from 'nostr-tools';

export class Register {
	// TODO: set from config
	baseUrl = 'http://localhost:3333/';

	registId = '';
	email = '';
	userName = '';
	// HEX string
	npk = '';
	nsk = '';
	encryptNsk = '';

	encryptionKeyService: EncryptionKeyService;

	constructor() {
		this.encryptionKeyService = new EncryptionKeyService();
	}

	async registerStart(email: string, userName: string, encryptionKey: string): Promise<boolean> {
		this.email = email;
		this.userName = userName;
		this.nsk = generatePrivateKey();
		this.npk = getPublicKey(this.nsk);

		console.time('[Register] registerStart: encryptSecretKey');
		this.encryptNsk = await this.encryptionKeyService.encryptSecretKey(this.nsk, encryptionKey);
		console.timeEnd('[Register] registerStart: encryptSecretKey');

		const options = await this.fetchOptions();

		const res = await create(parseCreationOptionsFromJSON({ publicKey: options }));

		await this.postSign(res.toJSON());

		const strage = new Strage();

		// success and login
		strage.setEncryptionKey(encryptionKey);
		strage.setNpub(nip19.npubEncode(this.npk));
		strage.setNsec(nip19.nsecEncode(this.nsk));
		strage.setUserName(this.userName);

		return true;
	}

	private async fetchOptions(): Promise<PublicKeyCredentialCreationOptionsJSON> {
		const postReq = new Request(this.baseUrl + 'register-start', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: this.email,
				npub: nip19.npubEncode(this.npk),
				encryptNsec: this.encryptNsk,
				userName: this.userName
			})
		});
		const response = await fetch(postReq);

		if (!response.ok) {
			throw new Error((await response.json()).message);
		}

		const { id, option } = (await response.json()) as {
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
