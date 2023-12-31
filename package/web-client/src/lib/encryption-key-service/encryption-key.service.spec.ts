import { expect, describe, it, beforeEach } from 'vitest';
import { EncryptionKeyService } from './encryption-key.service';

describe('EncryptionKeyService', () => {
	let service: EncryptionKeyService;

	beforeEach(() => {
		service = new EncryptionKeyService();
	});

	it('should be exist', () => {
		expect(service).toBeDefined();
	});

	it('should encrypt and decrypt', async () => {
		const orgSrc = 'abcdefgh';

		// iv will be needed for decryption
		const iv = window.crypto.getRandomValues(new Uint8Array(12));
		const orgKey = '9MP0pTNnaAdb';

		const encrypted = await service.encrypt(orgSrc, orgKey, iv);

		expect(encrypted).toBeDefined();
		expect(encrypted).toBeTypeOf('string');

		const decrypt = await service.decrypt(encrypted, orgKey, iv);

		expect(decrypt).toBeDefined();
		expect(decrypt).toBe(orgSrc);
	});

	it('should get string iv', () => {
		const res = service.ivToBase64url(Uint8Array.from([1, 2, 3, 4, 5]));

		expect(res).toBeDefined();
		expect(res).toBe('AQIDBAU');
	});

	it('should get string iv', () => {
		const res = service.base64urlToIv('AQIDBAU');

		expect(res).toBeDefined();
		expect(res).toEqual(Uint8Array.from([1, 2, 3, 4, 5]));
	});

	it('should encrypt and decrypt SecretKey', async () => {
		const expected = 'e2b6d49918eeead68c657d1b4d2d0472fdd11434d63a287c4d3e926fd7c1dba0';
		const encKey = '9MP0pTNnaAdb';
		const encrypted = await service.encryptSecretKey(expected, encKey);

		const result = await service.decryptSecretKey(encrypted, encKey);

		expect(result).toBe(expected);
	});
});
