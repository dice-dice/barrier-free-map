import { Pressable, Text, View } from 'react-native';
import type { MyConfirmation } from '../hooks/useMyConfirmations';
import type { FacilityListItem as FacilityListItemData } from '../lib/facilityDisplay';
import { ConfirmationButtons } from './ConfirmationButtons';
import { FacilityPhotoGallery } from './FacilityPhotoGallery';

interface FacilityListItemProps {
  facility: FacilityListItemData;
  userId: string;
  myConfirmation?: MyConfirmation;
  onViewOnMap: (facility: FacilityListItemData) => void;
}

export function FacilityListItem({ facility, userId, myConfirmation, onViewOnMap }: FacilityListItemProps) {
  return (
    <View className="mb-3 rounded-xl border border-[#e5e5e5] p-4">
      <FacilityPhotoGallery photoUrls={facility.photoUrls} />
      {facility.isUnverifiedImport ? (
        <View className="mb-2 self-start rounded-full bg-[#fdf0d5] px-2.5 py-[3px]">
          <Text className="text-[11px] font-bold text-[#a15c07]">OpenStreetMap由来・未確認</Text>
        </View>
      ) : null}
      <Text className="mb-1 text-[16px] font-bold text-[#1a1a1a]">{facility.name}</Text>
      {facility.address ? (
        <Text className="mb-2.5 text-[13px] text-[#5a5a5a]">{facility.address}</Text>
      ) : null}
      <View className="flex-row flex-wrap gap-2">
        <FeatureBadge label="車椅子対応" active={facility.isWheelchairAccessible} />
        <FeatureBadge label="多目的トイレ" active={facility.hasAccessibleToilet} />
        <FeatureBadge label="エレベーター" active={facility.hasElevator} />
      </View>
      <Pressable onPress={() => onViewOnMap(facility)} className="mt-3 self-start">
        <Text className="text-[13px] font-semibold text-blue-600">地図で見る</Text>
      </Pressable>
      <ConfirmationButtons
        spotId={facility.id}
        userId={userId}
        confirmedCount={facility.confirmedCount}
        disputedCount={facility.disputedCount}
        myConfirmation={myConfirmation}
      />
    </View>
  );
}

interface FeatureBadgeProps {
  label: string;
  active: boolean;
}

function FeatureBadge({ label, active }: FeatureBadgeProps) {
  return (
    <View className={`rounded-full px-2.5 py-1 ${active ? 'bg-[#e7f6ec]' : 'bg-[#f2f2f2]'}`}>
      <Text className={`text-[12px] font-semibold ${active ? 'text-[#1a7f37]' : 'text-[#9a9a9a]'}`}>
        {active ? `✓ ${label}` : label}
      </Text>
    </View>
  );
}
