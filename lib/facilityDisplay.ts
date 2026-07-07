import type { Database } from './database.types';

type SpotRow = Database['public']['Tables']['spots']['Row'];
type FacilitySourceSpot = Pick<
  SpotRow,
  'id' | 'name' | 'address' | 'category' | 'accessibility_features'
>;

export interface FacilityListItem {
  id: string;
  name: string;
  address: string | null;
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
    isWheelchairAccessible: spot.accessibility_features.includes(WHEELCHAIR_TAG),
    hasAccessibleToilet:
      spot.category === 'toilet' || spot.accessibility_features.includes(MULTIPURPOSE_TOILET_TAG),
    hasElevator: spot.category === 'elevator' || spot.accessibility_features.includes(ELEVATOR_TAG),
  };
}
