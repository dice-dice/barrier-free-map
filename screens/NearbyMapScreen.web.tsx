import { Text, View } from 'react-native';
import type { FacilityListItem } from '../lib/facilityDisplay';

interface NearbyMapScreenProps {
  focusedFacility?: FacilityListItem | null;
  onSelectLocation?: (location: { latitude: number; longitude: number }) => void;
}

export function NearbyMapScreen(_props: NearbyMapScreenProps) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Text className="mb-2 text-center text-[16px] font-semibold text-[#1a1a1a]">
        地図はモバイルアプリでご利用いただけます
      </Text>
      <Text className="text-center text-[14px] text-[#5a5a5a]">
        地図機能は現在iOS/Androidアプリでのみ対応しています。Web版では「一覧」タブから施設をご確認ください。
      </Text>
    </View>
  );
}
