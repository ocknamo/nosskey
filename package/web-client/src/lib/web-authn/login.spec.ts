import { expect, describe, it, beforeEach } from 'vitest';
import { Login } from './login';

describe('Login', () => {
	let service: Login;

	beforeEach(() => {
		service = new Login();
	});

	it('should be exist', () => {
		expect(service).toBeDefined();
	});
});
