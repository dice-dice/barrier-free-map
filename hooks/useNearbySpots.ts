import { useEffect, useState } from 'react';
import type { Coordinates } from './useCurrentLocation';
import { toNearbySpotMarker, type NearbySpotMarker } from '../lib/nearbySpots';
import { supabase } from '../lib/supabase';

const DEFAULT_RADIUS_METERS = 2000;

export function useNearbySpots(coordinates: Coordinates | null) {
  const [spots, setSpots] = useState<NearbySpotMarker[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!coordinates) {
      return;
    }

    let isMounted = true;
    setLoading(true);
    setErrorMessage(null);

    supabase
      .rpc('get_nearby_spots', {
        lat: coordinates.latitude,
        lng: coordinates.longitude,
        radius_meters: DEFAULT_RADIUS_METERS,
      })
      .then(({ data, error }) => {
        if (!isMounted) {
          return;
        }

        if (error) {
          setErrorMessage(error.message);
        } else {
          setSpots(data.map(toNearbySpotMarker));
        }

        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [coordinates]);

  return { spots, loading, errorMessage };
}
