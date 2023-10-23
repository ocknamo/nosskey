import { base64urlToBuffer, bufferToBase64url } from '@github/webauthn-json/extended';

export class WebCrypto {
	/**
	 * Get hashed key from original key.
	 * @param key base64url only
	 */
	static getKeyHash(key: string): Promise<ArrayBuffer> {
		return this.stretching(base64urlToBuffer(key));
	}

	/**
	 * stretching
	 * stretch count はブラウザで実行することを考慮して最小限
	 * @param src
	 * @param count default 10000
	 * @returns
	 */
	private static async stretching(src: ArrayBuffer, count: number = 10000): Promise<ArrayBuffer> {
		let data = src;
		let i = count;

		while (i > 0) {
			data = await this.hash(data);

			i = i - 1;
		}

		return data;
	}

	/**
	 * hash
	 * @param data source
	 * @returns hased data
	 */
	private static hash(data: ArrayBuffer): Promise<ArrayBuffer> {
		return window.crypto.subtle.digest('SHA-256', data);
	}

	/**
	 * encrypt AES-GCM
	 */
	static async encrypt(src: ArrayBuffer, key: ArrayBuffer, iv: Uint8Array): Promise<ArrayBuffer> {
		const cryptoKey = await window.crypto.subtle.importKey('raw', key, 'AES-GCM', false, [
			'encrypt',
			'decrypt'
		]);

		return window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, src);
	}

	/**
	 * decryot encrypt AES-GCM
	 */
	static async decrypt(src: ArrayBuffer, key: ArrayBuffer, iv: Uint8Array): Promise<ArrayBuffer> {
		const cryptoKey = await window.crypto.subtle.importKey('raw', key, 'AES-GCM', false, [
			'encrypt',
			'decrypt'
		]);

		return window.crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, src);
	}
}
