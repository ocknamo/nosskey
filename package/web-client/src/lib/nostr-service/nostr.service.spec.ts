import { expect, describe, it, beforeEach } from 'vitest';
import { NostrService } from './nostr.service';

describe('NostrService', () => {
	let service: NostrService;

	beforeEach(() => {
		service = new NostrService();
	});

	it('should be exist', () => {
		expect(service).toBeDefined();
	});
});
