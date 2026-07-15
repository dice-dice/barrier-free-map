import type { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { FacilityList } from '../components/FacilityList';
import { LinkButton } from '../components/LinkButton';
import { PrimaryButton } from '../components/PrimaryButton';
import { useConfirmSpot, type PendingConfirmation } from '../hooks/useConfirmSpot';
import { useIsAdmin } from '../hooks/useIsAdmin';
import { usePendingSpots } from '../hooks/usePendingSpots';
import { useSignOut } from '../hooks/useSignOut';
import type { FacilityListItem } from '../lib/facilityDisplay';
import { AdminReviewScreen } from './AdminReviewScreen';
import { AuthScreen } from './AuthScreen';
import { CreateFacilityScreen } from './CreateFacilityScreen';
import { MySubmissionsScreen } from './MySubmissionsScreen';
import { NearbyMapScreen } from './NearbyMapScreen';

type ViewMode = 'list' | 'map';

interface MainScreenProps {
  session: Session | null;
}

export function MainScreen({ session }: MainScreenProps) {
  const { signOut, loading, errorMessage } = useSignOut();
  const { mutate: confirmSpot } = useConfirmSpot();
  const isAdmin = useIsAdmin(session?.user.id ?? null);
  const { pendingSpots } = usePendingSpots(isAdmin);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isCreating, setIsCreating] = useState(false);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
  const [isReviewingPending, setIsReviewingPending] = useState(false);
  const [isViewingMySubmissions, setIsViewingMySubmissions] = useState(false);
  const [focusedFacility, setFocusedFacility] = useState<FacilityListItem | null>(null);
  const [pendingLocation, setPendingLocation] = useState<{ latitude: number; longitude: number } | null>(
    null
  );
  const [pendingConfirmation, setPendingConfirmation] = useState<PendingConfirmation | null>(null);

  useEffect(() => {
    if (session) {
      setIsAuthPromptOpen(false);
    }
  }, [session]);

  useEffect(() => {
    if (session && pendingConfirmation) {
      confirmSpot({ ...pendingConfirmation, userId: session.user.id });
      setPendingConfirmation(null);
    }
  }, [session, pendingConfirmation, confirmSpot]);

  if (isAuthPromptOpen) {
    return (
      <View className="flex-1 bg-white">
        <View className="px-6 pt-6">
          <LinkButton label="← 閲覧に戻る" onPress={() => setIsAuthPromptOpen(false)} />
        </View>
        <AuthScreen />
      </View>
    );
  }

  if (isCreating && session && pendingLocation) {
    return (
      <CreateFacilityScreen
        createdBy={session.user.id}
        onDone={() => {
          setIsCreating(false);
          setPendingLocation(null);
        }}
        location={pendingLocation}
      />
    );
  }

  if (isReviewingPending && isAdmin) {
    return <AdminReviewScreen onDone={() => setIsReviewingPending(false)} />;
  }

  if (isViewingMySubmissions && session) {
    return <MySubmissionsScreen userId={session.user.id} onDone={() => setIsViewingMySubmissions(false)} />;
  }

  const requireLogin = (pending?: PendingConfirmation) => {
    if (pending) {
      setPendingConfirmation(pending);
    }
    setIsAuthPromptOpen(true);
  };

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
    if (!session) {
      requireLogin();
      return;
    }
    setPendingLocation(location);
    setIsCreating(true);
  };

  return (
    <View className="flex-1 bg-white">
      <View className="px-6 pb-4 pt-6">
        <Text className="mb-1 text-[20px] font-semibold text-[#1a1a1a]">施設一覧</Text>
        {session ? (
          <Text className="mb-3 text-[14px] text-[#5a5a5a]">{session.user.email}</Text>
        ) : (
          <Text className="mb-3 text-[14px] text-[#5a5a5a]">ゲストとして閲覧中</Text>
        )}
        {errorMessage ? <Text className="mb-3 text-[14px] text-[#d92d20]">{errorMessage}</Text> : null}
        <View className="flex-row flex-wrap gap-2">
          {session ? (
            <>
              <PrimaryButton label="マイ投稿" onPress={() => setIsViewingMySubmissions(true)} />
              <PrimaryButton label="ログアウト" onPress={() => signOut()} loading={loading} />
            </>
          ) : (
            <PrimaryButton label="ログイン" onPress={() => requireLogin()} />
          )}
          {isAdmin ? (
            <PrimaryButton
              label={`承認待ち (${pendingSpots.length})`}
              onPress={() => setIsReviewingPending(true)}
            />
          ) : null}
        </View>
        <View className="mt-4 flex-row gap-2">
          <ViewModeTab label="一覧" active={viewMode === 'list'} onPress={() => handleSelectTab('list')} />
          <ViewModeTab label="地図" active={viewMode === 'map'} onPress={() => handleSelectTab('map')} />
        </View>
      </View>
      {viewMode === 'list' ? (
        <FacilityList
          userId={session?.user.id ?? null}
          isAdmin={isAdmin}
          onViewOnMap={handleViewOnMap}
          onRequireLogin={requireLogin}
        />
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
