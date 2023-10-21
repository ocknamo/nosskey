import { base64urlToBuffer, bufferToBase64url } from '@github/webauthn-json/extended';

export class WebCrypto {
	/**
	 * Get hashed password.
	 * @param pass base64url // FIXME
	 */
	static getPasswordHash(password: string): Promise<string> {
		return this.stretching(base64urlToBuffer(password)).then((v) => bufferToBase64url(v));
	}

	/**
	 * stretching
	 * stretch count はブラウザで実行することを考慮して最小限
	 * @param src
	 * @param count default 10000
	 * @returns
	 */
	static async stretching(src: ArrayBuffer, count: number = 10000): Promise<ArrayBuffer> {
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
	static hash(data: ArrayBuffer): Promise<ArrayBuffer> {
		return window.crypto.subtle.digest('SHA-256', data);
	}

	/**
	 * TODO: 暗号化
	 */

	/**
	 * NOTE: saltは不要？
	 */
}
