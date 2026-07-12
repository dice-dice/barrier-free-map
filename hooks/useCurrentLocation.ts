import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export function useCurrentLocation() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        if (isMounted) {
          setErrorMessage('位置情報の利用が許可されていません');
          setLoading(false);
        }
        return;
      }

      try {
        const position = await Location.getCurrentPositionAsync({});

        if (isMounted) {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : '現在地の取得に失敗しました');
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return { coordinates, loading, errorMessage };
}
