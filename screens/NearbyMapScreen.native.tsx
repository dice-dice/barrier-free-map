import { useState } from 'react';
import { ActivityIndicator, Linking, Platform, Text, View } from 'react-native';
import MapView, { LongPressEvent, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { useNearbySpots } from '../hooks/useNearbySpots';
import type { FacilityListItem } from '../lib/facilityDisplay';

interface NearbyMapScreenProps {
  focusedFacility?: FacilityListItem | null;
  onSelectLocation?: (location: { latitude: number; longitude: number }) => void;
}

function openDirections(latitude: number, longitude: number) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  Linking.openURL(url);
}

const NEAR_EXISTING_SPOT_THRESHOLD_DEGREES = 0.0003; // おおよそ30m相当

function isNearExistingSpot(
  location: { latitude: number; longitude: number },
  existingSpots: { latitude: number; longitude: number }[]
): boolean {
  return existingSpots.some(
    (spot) =>
      Math.abs(spot.latitude - location.latitude) < NEAR_EXISTING_SPOT_THRESHOLD_DEGREES &&
      Math.abs(spot.longitude - location.longitude) < NEAR_EXISTING_SPOT_THRESHOLD_DEGREES
  );
}

export function NearbyMapScreen({ focusedFacility, onSelectLocation }: NearbyMapScreenProps) {
  const { coordinates, loading: locationLoading, errorMessage: locationError } = useCurrentLocation();
  const { spots, loading: spotsLoading, errorMessage: spotsError } = useNearbySpots(coordinates);
  const [pendingLocation, setPendingLocation] = useState<{ latitude: number; longitude: number } | null>(
    null
  );

  if (locationLoading) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (locationError || !coordinates) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-center text-[14px] text-[#d92d20]">
          {locationError ?? '現在地を取得できませんでした'}
        </Text>
      </View>
    );
  }

  const region = focusedFacility
    ? { latitude: focusedFacility.latitude, longitude: focusedFacility.longitude }
    : { latitude: coordinates.latitude, longitude: coordinates.longitude };

  const markers = focusedFacility
    ? [focusedFacility, ...spots.filter((spot) => spot.id !== focusedFacility.id)]
    : spots;

  const handleLongPress = (event: LongPressEvent) => {
    const location = event.nativeEvent.coordinate;

    if (isNearExistingSpot(location, markers)) {
      return;
    }

    setPendingLocation(location);
  };

  const handleConfirmPendingLocation = () => {
    if (pendingLocation) {
      onSelectLocation?.(pendingLocation);
      setPendingLocation(null);
    }
  };

  return (
    <View className="flex-1">
      <MapView
        style={{ flex: 1 }}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        showsUserLocation
        onLongPress={onSelectLocation ? handleLongPress : undefined}
        initialRegion={{
          latitude: region.latitude,
          longitude: region.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {markers.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
            title={spot.name}
            description={spot.address ? `${spot.address} ・ タップで経路案内` : 'タップで経路案内'}
            onCalloutPress={() => openDirections(spot.latitude, spot.longitude)}
            pinColor={focusedFacility?.id === spot.id ? 'blue' : undefined}
          />
        ))}
        {pendingLocation ? (
          <Marker
            coordinate={pendingLocation}
            title="この場所を登録しますか？"
            description="タップして登録画面を開く"
            pinColor="green"
            onCalloutPress={handleConfirmPendingLocation}
          />
        ) : null}
      </MapView>
      {spotsLoading ? (
        <View className="absolute top-4 self-center rounded-full bg-white p-2">
          <ActivityIndicator />
        </View>
      ) : null}
      {spotsError ? (
        <View className="absolute bottom-4 left-4 right-4 rounded-lg bg-white p-3">
          <Text className="text-center text-[13px] text-[#d92d20]">{spotsError}</Text>
        </View>
      ) : null}
      {onSelectLocation ? (
        <View className="absolute top-4 left-4 right-4 rounded-lg bg-white/90 p-2">
          <Text className="text-center text-[12px] text-[#5a5a5a]">
            {pendingLocation
              ? '緑のピンをタップすると登録画面が開きます'
              : '地図を長押しすると、その場所を施設として登録できます'}
          </Text>
        </View>
      ) : null}
      <Text className="absolute bottom-1 right-2 bg-white/70 px-1 text-[10px] text-[#5a5a5a]">
        © OpenStreetMap contributors
      </Text>
    </View>
  );
}
