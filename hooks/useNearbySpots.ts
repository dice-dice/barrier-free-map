import { useQuery } from '@tanstack/react-query';
import type { Coordinates } from './useCurrentLocation';
import { toNearbySpotMarker, type NearbySpotMarker } from '../lib/nearbySpots';
import { supabase } from '../lib/supabase';

const DEFAULT_RADIUS_METERS = 2000;

async function fetchNearbySpots(coordinates: Coordinates, radiusMeters: number): Promise<NearbySpotMarker[]> {
  const { data, error } = await supabase.rpc('get_nearby_spots', {
    lat: coordinates.latitude,
    lng: coordinates.longitude,
    radius_meters: radiusMeters,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data.map(toNearbySpotMarker);
}

export function useNearbySpots(coordinates: Coordinates | null, radiusMeters: number = DEFAULT_RADIUS_METERS) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['nearbySpots', coordinates?.latitude, coordinates?.longitude, radiusMeters],
    queryFn: () => fetchNearbySpots(coordinates as Coordinates, radiusMeters),
    enabled: coordinates !== null,
  });

  return {
    spots: data ?? [],
    loading: isLoading,
    errorMessage: error instanceof Error ? error.message : null,
  };
}
