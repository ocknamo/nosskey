/**
 * Strage keys
 */
const enkKeyKey = 'encryption_key';
const userNameKey = 'user_name';
const npubKey = 'npublic_key';
const nsecKey = 'nsecret_key';

export class Strage {
	setEncryptionKey(enkKey: string): void {
		this.setToSession(enkKeyKey, enkKey);
	}

	getEncryptionKey(): string | null {
		return this.getFromSession(enkKeyKey);
	}

	setUserName(userName: string): void {
		this.setToLocal(userNameKey, userName);
	}

	getUserName(): string | null {
		return this.getFromLocal(userNameKey);
	}

	setNpub(npub: string): void {
		this.setToLocal(npubKey, npub);
	}

	getNpub(): string | null {
		return this.getFromLocal(npubKey);
	}

	setNsec(nsec: string): void {
		this.setToSession(nsecKey, nsec);
	}

	getNsec(): string | null {
		return this.getFromSession(nsecKey);
	}

	clearAll(): void {
		window.sessionStorage.clear();
		window.localStorage.clear();
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
