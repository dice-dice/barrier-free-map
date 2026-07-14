import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useFacilities } from '../hooks/useFacilities';
import { useMyConfirmations } from '../hooks/useMyConfirmations';
import type { FacilityListItem as FacilityListItemData } from '../lib/facilityDisplay';
import { FacilityListItem } from './FacilityListItem';
import { OsmAttribution } from './OsmAttribution';

interface FacilityListProps {
  userId: string;
  onViewOnMap: (facility: FacilityListItemData) => void;
}

export function FacilityList({ userId, onViewOnMap }: FacilityListProps) {
  const { facilities, loading, errorMessage } = useFacilities();
  const myConfirmations = useMyConfirmations(userId);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-center text-[14px] text-[#d92d20]">{errorMessage}</Text>
      </View>
    );
  }

  if (facilities.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-center text-[14px] text-[#5a5a5a]">施設が登録されていません</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={facilities}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <FacilityListItem
          facility={item}
          userId={userId}
          myConfirmation={myConfirmations[item.id]}
          onViewOnMap={onViewOnMap}
        />
      )}
      contentContainerClassName="px-6 pb-6"
      ListFooterComponent={OsmAttribution}
    />
  );
}
