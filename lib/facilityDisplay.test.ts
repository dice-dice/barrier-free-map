import { toFacilityListItem } from './facilityDisplay';

describe('toFacilityListItem', () => {
  const baseSpot = {
    id: '1',
    name: 'テスト施設',
    address: '東京都千代田区1-1-1',
    category: 'other' as const,
    accessibility_features: [] as string[],
    photo_urls: [] as string[],
    source: 'user_submitted' as const,
    latitude: 35.681236,
    longitude: 139.767052,
  };

  it('passes through id, name, and address', () => {
    const result = toFacilityListItem(baseSpot);
    expect(result.id).toBe('1');
    expect(result.name).toBe('テスト施設');
    expect(result.address).toBe('東京都千代田区1-1-1');
  });

  it('passes through photo_urls as photoUrls', () => {
    const result = toFacilityListItem({
      ...baseSpot,
      photo_urls: ['https://example.com/a.jpg', 'https://example.com/b.jpg'],
    });
    expect(result.photoUrls).toEqual(['https://example.com/a.jpg', 'https://example.com/b.jpg']);
  });

  it('returns an empty array when there are no photos', () => {
    const result = toFacilityListItem(baseSpot);
    expect(result.photoUrls).toEqual([]);
  });

  it('marks wheelchair accessible when the tag is present', () => {
    const result = toFacilityListItem({ ...baseSpot, accessibility_features: ['wheelchair'] });
    expect(result.isWheelchairAccessible).toBe(true);
  });

  it('marks not wheelchair accessible when the tag is absent', () => {
    const result = toFacilityListItem(baseSpot);
    expect(result.isWheelchairAccessible).toBe(false);
  });

  it('marks accessible toilet when category is toilet', () => {
    const result = toFacilityListItem({ ...baseSpot, category: 'toilet' });
    expect(result.hasAccessibleToilet).toBe(true);
  });

  it('marks accessible toilet when the tag is present regardless of category', () => {
    const result = toFacilityListItem({
      ...baseSpot,
      accessibility_features: ['multipurpose_toilet'],
    });
    expect(result.hasAccessibleToilet).toBe(true);
  });

  it('does not mark accessible toilet when neither category nor tag matches', () => {
    const result = toFacilityListItem(baseSpot);
    expect(result.hasAccessibleToilet).toBe(false);
  });

  it('marks elevator when category is elevator', () => {
    const result = toFacilityListItem({ ...baseSpot, category: 'elevator' });
    expect(result.hasElevator).toBe(true);
  });

  it('marks elevator when the tag is present regardless of category', () => {
    const result = toFacilityListItem({ ...baseSpot, accessibility_features: ['elevator'] });
    expect(result.hasElevator).toBe(true);
  });

  it('does not mark elevator when neither category nor tag matches', () => {
    const result = toFacilityListItem(baseSpot);
    expect(result.hasElevator).toBe(false);
  });

  it('marks unverified when source is openstreetmap', () => {
    const result = toFacilityListItem({ ...baseSpot, source: 'openstreetmap' });
    expect(result.isUnverifiedImport).toBe(true);
  });

  it('does not mark unverified when source is user_submitted', () => {
    const result = toFacilityListItem(baseSpot);
    expect(result.isUnverifiedImport).toBe(false);
  });
});
