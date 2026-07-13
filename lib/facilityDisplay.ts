import type { SpotCategory, SpotSource } from './database.types';
import { ELEVATOR_TAG, MULTIPURPOSE_TOILET_TAG, WHEELCHAIR_TAG } from './facilityOptions';

export interface FacilitySourceSpot {
  id: string;
  name: string;
  address: string | null;
  category: SpotCategory;
  accessibility_features: string[];
  photo_urls: string[];
  source: SpotSource;
  latitude: number;
  longitude: number;
  confirmed_count: number;
  disputed_count: number;
}

export interface FacilityListItem {
  id: string;
  name: string;
  address: string | null;
  photoUrls: string[];
  isWheelchairAccessible: boolean;
  hasAccessibleToilet: boolean;
  hasElevator: boolean;
  isUnverifiedImport: boolean;
  latitude: number;
  longitude: number;
  confirmedCount: number;
  disputedCount: number;
}

export function toFacilityListItem(spot: FacilitySourceSpot): FacilityListItem {
  return {
    id: spot.id,
    name: spot.name,
    address: spot.address,
    photoUrls: spot.photo_urls,
    latitude: spot.latitude,
    longitude: spot.longitude,
    isWheelchairAccessible: spot.accessibility_features.includes(WHEELCHAIR_TAG),
    hasAccessibleToilet:
      spot.category === 'toilet' || spot.accessibility_features.includes(MULTIPURPOSE_TOILET_TAG),
    hasElevator: spot.category === 'elevator' || spot.accessibility_features.includes(ELEVATOR_TAG),
    isUnverifiedImport: spot.source === 'openstreetmap',
    confirmedCount: spot.confirmed_count,
    disputedCount: spot.disputed_count,
  };
}
