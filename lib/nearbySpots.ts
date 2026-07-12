import type { Database } from './database.types';
import { toFacilityListItem, type FacilityListItem } from './facilityDisplay';

type NearbySpotRow = Database['public']['Functions']['get_nearby_spots']['Returns'][number];

export interface NearbySpotMarker extends FacilityListItem {
  latitude: number;
  longitude: number;
  distanceMeters: number;
}

export function toNearbySpotMarker(row: NearbySpotRow): NearbySpotMarker {
  return {
    ...toFacilityListItem(row),
    latitude: row.latitude,
    longitude: row.longitude,
    distanceMeters: row.distance_meters,
  };
}
