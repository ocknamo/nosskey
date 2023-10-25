import { expect, describe, it, beforeEach } from 'vitest';
import { Strage } from './strage';

describe('Strage', () => {
	let service: Strage;

	beforeEach(() => {
		service = new Strage();

		window.sessionStorage.clear();
		window.localStorage.clear();
	});

	it('should be exist', () => {
		expect(service).toBeDefined();
	});

	it('should set and get EncryptionKey', async () => {
		await service.setEncryptionKey('enc_key');

		const res = service.getEncryptionKey();

		expect(res).toBe('enc_key');
	});

	it('should set and get UserName', async () => {
		await service.setUserName('user_name');

		const res = service.getUserName();

		expect(res).toBe('user_name');
	});

	it('should set and get Npub', async () => {
		await service.setNpub('n_public_key');

		const res = service.getNpub();

		expect(res).toBe('n_public_key');
	});

	it('should set and get Nsec', async () => {
		await service.setNsec('n_secret_key');

		const res = service.getNsec();

		expect(res).toBe('n_secret_key');
	});

	it('should clear all', async () => {
		await service.setUserName('user_name');

		let res = service.getUserName();

		expect(res).toBe('user_name');

		service.clearAll();

		res = service.getUserName();
		expect(res).toBe(null);
	});
});
