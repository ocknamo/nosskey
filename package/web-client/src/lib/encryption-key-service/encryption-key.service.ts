import { WebCrypto } from '$lib/web-crypto/web-crypto';
import { base64urlToBuffer, bufferToBase64url } from '@github/webauthn-json/extended';

export class EncryptionKeyService {
	constructor() {}

	async encryptSecretKey(secretKey: string, encriptionKey: string): Promise<string> {
		const iv = window.crypto.getRandomValues(new Uint8Array(12));

		const enc = await this.encrypt(secretKey, encriptionKey, iv);

		return [enc, this.ivToBase64url(iv)].join('.');
	}

	decryptSecretKey(cryptedSecretKey: string, encriptionKey: string): Promise<string> {
		const [src, ivString] = cryptedSecretKey.split('.');

		const iv = this.base64urlToIv(ivString);

		return this.decrypt(src, encriptionKey, iv);
	}

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
