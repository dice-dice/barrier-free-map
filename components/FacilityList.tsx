import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import type { PendingConfirmation } from '../hooks/useConfirmSpot';
import { useFacilities } from '../hooks/useFacilities';
import { useMyConfirmations } from '../hooks/useMyConfirmations';
import { usePublicComments } from '../hooks/usePublicComments';
import type { FacilityListItem as FacilityListItemData } from '../lib/facilityDisplay';
import { FacilityListItem } from './FacilityListItem';
import { OsmAttribution } from './OsmAttribution';

interface FacilityListProps {
  userId: string | null;
  onViewOnMap: (facility: FacilityListItemData) => void;
  onRequireLogin: (pending: PendingConfirmation) => void;
}

export function FacilityList({ userId, onViewOnMap, onRequireLogin }: FacilityListProps) {
  const { facilities, loading, errorMessage } = useFacilities();
  const myConfirmations = useMyConfirmations(userId);
  const publicComments = usePublicComments();

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
          comments={publicComments[item.id] ?? []}
          onViewOnMap={onViewOnMap}
          onRequireLogin={onRequireLogin}
        />
      )}
      contentContainerClassName="px-6 pb-6"
      ListFooterComponent={OsmAttribution}
    />
  );
}
