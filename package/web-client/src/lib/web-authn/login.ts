import { get, parseRequestOptionsFromJSON } from '@github/webauthn-json/browser-ponyfill';

import type {
	PublicKeyCredentialCreationOptionsJSON,
	PublicKeyCredentialWithAssertionJSON
} from '@github/webauthn-json/dist/types/basic/json';

import { create, parseCreationOptionsFromJSON } from '@github/webauthn-json/browser-ponyfill';
import type { LoginCompleteResponse } from 'shared';
import { Strage } from '$lib/storage/strage';
import { EncryptionKeyService } from '$lib/encryption-key-service/encryption-key.service';
import { getPublicKey, nip19 } from 'nostr-tools';

export class Login {
	// TODO: set from config
	baseUrl = 'http://localhost:3333/';

	loginId = '';

	async loginStart(): Promise<void> {
		const options = await this.fetchOptions();

		const res = await get(parseRequestOptionsFromJSON({ publicKey: options }));

		// get userName
		const base64userName = res.toJSON().response.userHandle;

		if (!base64userName) {
			throw new Error('Invalie user name.');
		}

		const userName = atob(base64userName);

		const body = await this.postSign(res.toJSON());

		const strage = new Strage();

		// success and login
		// FIXME: なかったら入力させる
		const encKey = strage.getEncryptionKey();
		if (!encKey) {
			throw new Error('No EncryptionKey. plese input it!');
		}

		const encryptionKeyService = new EncryptionKeyService();

		const nsk = await encryptionKeyService.decryptSecretKey(body.encrypted, encKey);
		const npk = getPublicKey(nsk);

		strage.setNsec(nip19.nsecEncode(nsk));
		strage.setNpub(nip19.npubEncode(npk));
		strage.setUserName(userName);
	}

	private async fetchOptions() {
		const postReq = new Request(this.baseUrl + 'login/start', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' }
		});
		const response = await fetch(postReq);

		if (!response.ok) {
			throw new Error((await response.json()).message);
		}

		const { id, option } = (await response.json()) as {
			id: string;
			option: PublicKeyCredentialCreationOptionsJSON;
		};

		this.loginId = id;

		return option;
	}

	private async postSign(
		assertion: PublicKeyCredentialWithAssertionJSON
	): Promise<LoginCompleteResponse> {
		const postReq = new Request(this.baseUrl + 'login/complete', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id: this.loginId,
				assertion
			})
		});

		return (await fetch(postReq)).json();
	}
}
