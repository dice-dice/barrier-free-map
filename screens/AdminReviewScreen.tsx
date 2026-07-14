import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { LinkButton } from '../components/LinkButton';
import { PrimaryButton } from '../components/PrimaryButton';
import { useNearbySpots } from '../hooks/useNearbySpots';
import { usePendingSpots, type PendingSpot } from '../hooks/usePendingSpots';
import { useUpdateSpotStatus } from '../hooks/useUpdateSpotStatus';
import { CATEGORY_OPTIONS } from '../lib/facilityOptions';
import { distanceMeters } from '../lib/geo';

const DUPLICATE_CHECK_RADIUS_METERS = 20;

interface AdminReviewScreenProps {
  onDone: () => void;
}

export function AdminReviewScreen({ onDone }: AdminReviewScreenProps) {
  const { pendingSpots, loading, errorMessage } = usePendingSpots(true);

  return (
    <View className="flex-1 bg-white">
      <View className="px-6 pb-4 pt-6">
        <LinkButton label="← 一覧に戻る" onPress={onDone} />
        <Text className="mt-4 text-[20px] font-semibold text-[#1a1a1a]">承認待ちの投稿</Text>
        <Text className="text-[14px] text-[#5a5a5a]">{pendingSpots.length}件</Text>
      </View>
      {loading ? (
        <View className="flex-1 items-center justify-center px-6">
          <ActivityIndicator size="large" />
        </View>
      ) : errorMessage ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-[14px] text-[#d92d20]">{errorMessage}</Text>
        </View>
      ) : pendingSpots.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-[14px] text-[#5a5a5a]">承認待ちの投稿はありません</Text>
        </View>
      ) : (
        <ScrollView contentContainerClassName="px-6 pb-6">
          {pendingSpots.map((spot) => (
            <PendingSpotCard key={spot.id} spot={spot} otherPendingSpots={pendingSpots} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORY_OPTIONS.map((option) => [option.value, option.label])
);

interface DuplicateCandidate {
  id: string;
  name: string;
  distanceMeters: number;
}

interface PendingSpotCardProps {
  spot: PendingSpot;
  otherPendingSpots: PendingSpot[];
}

function PendingSpotCard({ spot, otherPendingSpots }: PendingSpotCardProps) {
  const { mutate, isPending } = useUpdateSpotStatus();
  const { spots: nearbyApprovedSpots } = useNearbySpots(
    { latitude: spot.latitude, longitude: spot.longitude },
    DUPLICATE_CHECK_RADIUS_METERS
  );

  const nearbyPendingSpots: DuplicateCandidate[] = otherPendingSpots
    .filter((other) => other.id !== spot.id)
    .map((other) => ({
      id: other.id,
      name: other.name,
      distanceMeters: distanceMeters(spot, other),
    }))
    .filter((other) => other.distanceMeters <= DUPLICATE_CHECK_RADIUS_METERS);

  const nearbyDuplicates: DuplicateCandidate[] = [...nearbyApprovedSpots, ...nearbyPendingSpots];

  return (
    <View className="mb-3 rounded-xl border border-[#e5e5e5] p-4">
      <Text className="mb-1 text-[16px] font-bold text-[#1a1a1a]">{spot.name}</Text>
      {spot.address ? <Text className="mb-1 text-[13px] text-[#5a5a5a]">{spot.address}</Text> : null}
      <Text className="mb-3 text-[12px] text-[#9a9a9a]">
        {CATEGORY_LABELS[spot.category] ?? spot.category}
      </Text>
      {nearbyDuplicates.length > 0 ? (
        <View className="mb-3 rounded-lg bg-[#fff8e5] p-3">
          <Text className="mb-1 text-[13px] font-semibold text-[#8a6d00]">
            近くに他の施設があります（重複の可能性）
          </Text>
          {nearbyDuplicates.map((nearby) => (
            <Text key={nearby.id} className="text-[13px] text-[#8a6d00]">
              ・{nearby.name}（約{Math.round(nearby.distanceMeters)}m）
            </Text>
          ))}
        </View>
      ) : null}
      <View className="flex-row gap-2">
        <PrimaryButton
          label="承認する"
          onPress={() => mutate({ spotId: spot.id, status: 'approved' })}
          loading={isPending}
        />
        <PrimaryButton
          label="非公開にする"
          onPress={() => mutate({ spotId: spot.id, status: 'rejected' })}
          loading={isPending}
        />
      </View>
    </View>
  );
}
