import { expect, describe, it } from 'vitest'
import { base642base64url } from "./random";

describe('base642base64url', () => {
  it('should get base64url string from base64 string', () => {
    expect(base642base64url('1234++5678//91011====')).toBe('1234--5678__91011');
  });
});