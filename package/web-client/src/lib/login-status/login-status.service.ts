import { Strage } from '$lib/storage/strage';

export class LoginStatusService {
	private _status: 'LOGGED_IN' | 'LOG_OUT' = 'LOG_OUT';
	strage: Strage;

	constructor() {
		this.strage = new Strage();
	}

	get status(): string {
		this.syncStatus();

		return this._status;
	}

	get isLoggedIn(): boolean {
		return this.status === 'LOGGED_IN';
	}

	private syncStatus(): void {
		if (this.strage.getNsec()) {
			this._status = 'LOGGED_IN';
		} else {
			this._status = 'LOG_OUT';
		}
	}
}
