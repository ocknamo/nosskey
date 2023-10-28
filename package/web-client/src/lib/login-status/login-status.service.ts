import { Strage } from '$lib/storage/strage';
import { BehaviorSubject } from 'rxjs';

export class LoginStatusService {
	private _status: 'LOGGED_IN' | 'LOG_OUT' = 'LOG_OUT';
	strage: Strage;

	isLoggedIn$ = new BehaviorSubject<boolean>(false);

	constructor() {
		this.strage = new Strage();
	}

	get status(): string {
		return this._status;
	}

	get isLoggedIn(): boolean {
		return this.status === 'LOGGED_IN';
	}

	syncStatus(): void {
		if (this.strage.getNsec()) {
			this._status = 'LOGGED_IN';
		} else {
			this._status = 'LOG_OUT';
		}

		this.isLoggedIn$.next(this.isLoggedIn);
	}
}
