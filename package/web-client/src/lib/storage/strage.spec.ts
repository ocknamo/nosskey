import { expect, describe, it, beforeEach } from 'vitest';
import { Strage } from './strage';

describe('Strage', () => {
	let service: Strage;

	beforeEach(() => {
		service = new Strage();
	});

	it('should be exist', () => {
		expect(service).toBeDefined();
	});

	it('should set and get session strage', async () => {
		await service.setEncryptionKey('enc_key');

		const res = service.getEncryptionKey();

		expect(res).toBe('enc_key');
	});
});
