import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { useNearbySpots } from '../hooks/useNearbySpots';

export function NearbyMapScreen() {
  const { coordinates, loading: locationLoading, errorMessage: locationError } = useCurrentLocation();
  const { spots, loading: spotsLoading, errorMessage: spotsError } = useNearbySpots(coordinates);

  if (locationLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (locationError || !coordinates) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{locationError ?? '現在地を取得できませんでした'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <MapView
        style={styles.flex}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        showsUserLocation
        initialRegion={{
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {spots.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
            title={spot.name}
            description={spot.address ?? undefined}
          />
        ))}
      </MapView>
      {spotsLoading ? (
        <View style={styles.loadingBadge}>
          <ActivityIndicator />
        </View>
      ) : null}
      {spotsError ? (
        <View style={styles.errorBadge}>
          <Text style={styles.errorBadgeText}>{spotsError}</Text>
        </View>
      ) : null}
      <Text style={styles.attribution}>© OpenStreetMap contributors</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    color: '#d92d20',
    fontSize: 14,
    textAlign: 'center',
  },
  loadingBadge: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 999,
    padding: 8,
  },
  errorBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
  },
  errorBadgeText: {
    color: '#d92d20',
    fontSize: 13,
    textAlign: 'center',
  },
  attribution: {
    position: 'absolute',
    bottom: 4,
    right: 8,
    fontSize: 10,
    color: '#5a5a5a',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 4,
  },
});
