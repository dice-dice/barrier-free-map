import { useRef, useState } from 'react';
import { ActivityIndicator, Linking, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import MapView, { LongPressEvent, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useAddressSearch, type AddressSearchResult } from '../hooks/useAddressSearch';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { useNearbySpots } from '../hooks/useNearbySpots';
import type { FacilityListItem } from '../lib/facilityDisplay';
import { PrimaryButton } from '../components/PrimaryButton';

interface NearbyMapScreenProps {
  focusedFacility?: FacilityListItem | null;
  onSelectLocation?: (location: { latitude: number; longitude: number }) => void;
}

function openDirections(latitude: number, longitude: number) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  Linking.openURL(url);
}

const NEAR_EXISTING_SPOT_THRESHOLD_DEGREES = 0.0003; // おおよそ30m相当
const ADDRESS_SEARCH_REGION_DELTA = 0.01;
const MAX_VISIBLE_ADDRESS_RESULTS = 20;

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
  const [isAddressSearchOpen, setIsAddressSearchOpen] = useState(false);
  const [addressQuery, setAddressQuery] = useState('');
  const {
    search: searchAddress,
    results: addressResults,
    loading: addressSearchLoading,
    errorMessage: addressSearchError,
    reset: resetAddressSearch,
  } = useAddressSearch();
  const mapRef = useRef<MapView>(null);

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

  const handleSearchAddress = () => {
    if (addressQuery.trim() === '') {
      return;
    }
    searchAddress(addressQuery.trim());
  };

  const handleSelectAddressResult = (result: AddressSearchResult) => {
    mapRef.current?.animateToRegion(
      {
        latitude: result.latitude,
        longitude: result.longitude,
        latitudeDelta: ADDRESS_SEARCH_REGION_DELTA,
        longitudeDelta: ADDRESS_SEARCH_REGION_DELTA,
      },
      500
    );
    setIsAddressSearchOpen(false);
    setAddressQuery('');
    resetAddressSearch();
  };

  return (
    <View className="flex-1">
      <MapView
        ref={mapRef}
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
      <View className="absolute left-4 right-4 top-4">
        {isAddressSearchOpen ? (
          <View className="rounded-lg bg-white p-3">
            <View className="flex-row gap-2">
              <TextInput
                value={addressQuery}
                onChangeText={setAddressQuery}
                placeholder="住所で地図を移動（例: 仙台市青葉区中央一丁目）"
                className="flex-1 rounded-lg border border-[#e5e5e5] px-3 py-2 text-[14px] text-[#1a1a1a]"
              />
              <PrimaryButton label="検索" onPress={handleSearchAddress} loading={addressSearchLoading} />
            </View>
            {addressSearchError ? (
              <Text className="mt-2 text-[13px] text-[#d92d20]">{addressSearchError}</Text>
            ) : null}
            {addressResults.length > 0 ? (
              <View className="mt-2 rounded-lg border border-[#e5e5e5]">
                <ScrollView className="max-h-[240px]" nestedScrollEnabled keyboardShouldPersistTaps="handled">
                  {addressResults.slice(0, MAX_VISIBLE_ADDRESS_RESULTS).map((result, index) => (
                    <Pressable
                      key={`${result.latitude}-${result.longitude}-${index}`}
                      onPress={() => handleSelectAddressResult(result)}
                      className={`px-3 py-2.5 ${index > 0 ? 'border-t border-[#e5e5e5]' : ''}`}
                    >
                      <Text className="text-[14px] text-[#1a1a1a]">{result.title}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
                {addressResults.length > MAX_VISIBLE_ADDRESS_RESULTS ? (
                  <Text className="border-t border-[#e5e5e5] px-3 py-2 text-[12px] text-[#9a9a9a]">
                    他{addressResults.length - MAX_VISIBLE_ADDRESS_RESULTS}件あります。住所をより詳しく入力すると絞り込めます
                  </Text>
                ) : null}
              </View>
            ) : null}
            <Pressable onPress={() => setIsAddressSearchOpen(false)} className="mt-2 items-center">
              <Text className="text-[13px] text-[#5a5a5a]">閉じる</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={() => setIsAddressSearchOpen(true)} className="self-start rounded-full bg-white p-2.5">
            <Text className="text-[13px] font-semibold text-[#1a1a1a]">住所で地図を移動</Text>
          </Pressable>
        )}
        {onSelectLocation ? (
          <View className="mt-2 rounded-lg bg-white/90 p-2">
            <Text className="text-center text-[12px] text-[#5a5a5a]">
              {pendingLocation
                ? '緑のピンをタップすると登録画面が開きます'
                : '地図を長押しすると、その場所を施設として登録できます'}
            </Text>
          </View>
        ) : null}
      </View>
      {spotsLoading ? (
        <View className="absolute bottom-4 self-center rounded-full bg-white p-2">
          <ActivityIndicator />
        </View>
      ) : null}
      {spotsError ? (
        <View className="absolute bottom-4 left-4 right-4 rounded-lg bg-white p-3">
          <Text className="text-center text-[13px] text-[#d92d20]">{spotsError}</Text>
        </View>
      ) : null}
      <Text className="absolute bottom-1 right-2 bg-white/70 px-1 text-[10px] text-[#5a5a5a]">
        © OpenStreetMap contributors
      </Text>
    </View>
  );
}
