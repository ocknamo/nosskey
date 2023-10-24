/**
 * Strage keys
 */
const enkKeyKey = 'encryption_key';

export class Strage {
	setEncryptionKey(enkKey: string): void {
		this.setToSession(enkKeyKey, enkKey);
	}

	getEncryptionKey(): string | null {
		return this.getFromSession(enkKeyKey);
	}

	private setToSession(key: string, value: string): void {
		return window.sessionStorage.setItem(key, value);
	}

	private getFromSession(key: string): string | null {
		return window.sessionStorage.getItem(key);
	}

	private setToLocal(key: string, value: string): void {
		return window.localStorage.setItem(key, value);
	}

	private getFromLocal(key: string): string | null {
		return window.localStorage.getItem(key);
	}
}
