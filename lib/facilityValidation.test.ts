import { isValidFacilityName } from './facilityValidation';

describe('isValidFacilityName', () => {
  it('accepts a non-empty name', () => {
    expect(isValidFacilityName('東京駅八重洲口')).toBe(true);
  });

  it('rejects an empty string', () => {
    expect(isValidFacilityName('')).toBe(false);
  });

  it('rejects a string with only whitespace', () => {
    expect(isValidFacilityName('   ')).toBe(false);
  });
});
