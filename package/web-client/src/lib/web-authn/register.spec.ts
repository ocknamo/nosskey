import { expect, describe, it, beforeEach } from 'vitest';
import { Register } from './register';

describe('Register', () => {
	let service: Register;

	beforeEach(() => {
		service = new Register('test_email', 'test_username', 'test_password');
	});

	it('should be exist', () => {
		expect(service).toBeDefined();
	});
});
