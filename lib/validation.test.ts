import { isValidEmail, isValidPassword } from './validation';

describe('isValidEmail', () => {
  it('accepts a well-formed email', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });

  it('accepts an email with surrounding whitespace', () => {
    expect(isValidEmail('  user@example.com  ')).toBe(true);
  });

  it('rejects a value without an @', () => {
    expect(isValidEmail('userexample.com')).toBe(false);
  });

  it('rejects a value without a domain', () => {
    expect(isValidEmail('user@')).toBe(false);
  });

  it('rejects an empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });
});

describe('isValidPassword', () => {
  it('accepts a password with exactly 8 characters', () => {
    expect(isValidPassword('12345678')).toBe(true);
  });

  it('accepts a password longer than 8 characters', () => {
    expect(isValidPassword('123456789')).toBe(true);
  });

  it('rejects a password shorter than 8 characters', () => {
    expect(isValidPassword('1234567')).toBe(false);
  });

  it('rejects an empty string', () => {
    expect(isValidPassword('')).toBe(false);
  });
});
