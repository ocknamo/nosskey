import { expect, describe, it, beforeEach } from 'vitest';
import { WebCrypto } from './web-crypto';

describe('WebCrypto', () => {
	let service: WebCrypto;

	beforeEach(() => {
		service = new WebCrypto();
	});

	it('should be exist', () => {
		expect(service).toBeDefined();
	});

	it('should get password hash', async () => {
		const res = await WebCrypto.getPasswordHash('9MP0pTNnaAdb');
		expect(res).toBeDefined();
	});
});
