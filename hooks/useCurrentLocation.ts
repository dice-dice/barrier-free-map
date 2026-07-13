import { useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

async function fetchCurrentLocation(): Promise<Coordinates> {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    throw new Error('位置情報の利用が許可されていません');
  }

  const position = await Location.getCurrentPositionAsync({});

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}

export function useCurrentLocation() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['currentLocation'],
    queryFn: fetchCurrentLocation,
    staleTime: Infinity,
    retry: false,
  });

  return {
    coordinates: data ?? null,
    loading: isLoading,
    errorMessage: error instanceof Error ? error.message : null,
  };
}
