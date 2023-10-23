import { WebCrypto } from '$lib/web-crypto/web-crypto';
import { base64urlToBuffer, bufferToBase64url } from '@github/webauthn-json/extended';

export class EncryptionKeyService {
	constructor() {}

	async encrypt(src: string, originalKey: string, iv: Uint8Array): Promise<string> {
		const key = await WebCrypto.getKeyHash(originalKey);
		const srcBuf = base64urlToBuffer(src);

		return WebCrypto.encrypt(srcBuf, key, iv).then((v) => bufferToBase64url(v));
	}

	async decrypt(encrypted: string, originalKey: string, iv: Uint8Array): Promise<string> {
		const encryptedBuf = base64urlToBuffer(encrypted);
		const key = await WebCrypto.getKeyHash(originalKey);

		return WebCrypto.decrypt(encryptedBuf, key, iv).then((v) => bufferToBase64url(v));
	}

	ivToBase64url(iv: Uint8Array): string {
		return bufferToBase64url(iv.buffer);
	}

	base64urlToIv(ivString: string): Uint8Array {
		return new Uint8Array(base64urlToBuffer(ivString));
	}
}
