import type { Session } from '@supabase/supabase-js';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { FacilityList } from '../components/FacilityList';
import { PrimaryButton } from '../components/PrimaryButton';
import { useSignOut } from '../hooks/useSignOut';
import type { FacilityListItem } from '../lib/facilityDisplay';
import { CreateFacilityScreen } from './CreateFacilityScreen';
import { NearbyMapScreen } from './NearbyMapScreen';

type ViewMode = 'list' | 'map';

interface MainScreenProps {
  session: Session;
}

export function MainScreen({ session }: MainScreenProps) {
  const { signOut, loading, errorMessage } = useSignOut();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isCreating, setIsCreating] = useState(false);
  const [focusedFacility, setFocusedFacility] = useState<FacilityListItem | null>(null);
  const [pendingLocation, setPendingLocation] = useState<{ latitude: number; longitude: number } | null>(
    null
  );

  if (isCreating) {
    return (
      <CreateFacilityScreen
        createdBy={session.user.id}
        onDone={() => {
          setIsCreating(false);
          setPendingLocation(null);
        }}
        initialLocation={pendingLocation}
      />
    );
  }

  const handleViewOnMap = (facility: FacilityListItem) => {
    setFocusedFacility(facility);
    setViewMode('map');
  };

  const handleSelectTab = (mode: ViewMode) => {
    if (mode === 'list') {
      setFocusedFacility(null);
    }
    setViewMode(mode);
  };

  const handleSelectLocation = (location: { latitude: number; longitude: number }) => {
    setPendingLocation(location);
    setIsCreating(true);
  };

  return (
    <View className="flex-1 bg-white">
      <View className="px-6 pb-4 pt-6">
        <Text className="mb-1 text-[20px] font-semibold text-[#1a1a1a]">施設一覧</Text>
        <Text className="mb-3 text-[14px] text-[#5a5a5a]">{session.user.email}</Text>
        {errorMessage ? <Text className="mb-3 text-[14px] text-[#d92d20]">{errorMessage}</Text> : null}
        <View className="flex-row gap-2">
          <PrimaryButton
            label="施設を登録"
            onPress={() => {
              setPendingLocation(null);
              setIsCreating(true);
            }}
          />
          <PrimaryButton label="ログアウト" onPress={() => signOut()} loading={loading} />
        </View>
        <View className="mt-4 flex-row gap-2">
          <ViewModeTab label="一覧" active={viewMode === 'list'} onPress={() => handleSelectTab('list')} />
          <ViewModeTab label="地図" active={viewMode === 'map'} onPress={() => handleSelectTab('map')} />
        </View>
      </View>
      {viewMode === 'list' ? (
        <FacilityList userId={session.user.id} onViewOnMap={handleViewOnMap} />
      ) : (
        <NearbyMapScreen focusedFacility={focusedFacility} onSelectLocation={handleSelectLocation} />
      )}
    </View>
  );
}

interface ViewModeTabProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function ViewModeTab({ label, active, onPress }: ViewModeTabProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 items-center rounded-lg py-2.5 ${active ? 'bg-blue-600' : 'bg-[#f2f2f2]'}`}
    >
      <Text className={`text-[14px] font-semibold ${active ? 'text-white' : 'text-[#5a5a5a]'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
