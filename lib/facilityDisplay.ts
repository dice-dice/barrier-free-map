import type { SpotCategory } from './database.types';

export interface FacilitySourceSpot {
  id: string;
  name: string;
  address: string | null;
  category: SpotCategory;
  accessibility_features: string[];
  photo_urls: string[];
}

export interface FacilityListItem {
  id: string;
  name: string;
  address: string | null;
  photoUrls: string[];
  isWheelchairAccessible: boolean;
  hasAccessibleToilet: boolean;
  hasElevator: boolean;
}

const WHEELCHAIR_TAG = 'wheelchair';
const MULTIPURPOSE_TOILET_TAG = 'multipurpose_toilet';
const ELEVATOR_TAG = 'elevator';

export function toFacilityListItem(spot: FacilitySourceSpot): FacilityListItem {
  return {
    id: spot.id,
    name: spot.name,
    address: spot.address,
    photoUrls: spot.photo_urls,
    isWheelchairAccessible: spot.accessibility_features.includes(WHEELCHAIR_TAG),
    hasAccessibleToilet:
      spot.category === 'toilet' || spot.accessibility_features.includes(MULTIPURPOSE_TOILET_TAG),
    hasElevator: spot.category === 'elevator' || spot.accessibility_features.includes(ELEVATOR_TAG),
  };
}
