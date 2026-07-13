import type { Session } from '@supabase/supabase-js';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FacilityList } from '../components/FacilityList';
import { PrimaryButton } from '../components/PrimaryButton';
import { useSignOut } from '../hooks/useSignOut';
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

  if (isCreating) {
    return <CreateFacilityScreen createdBy={session.user.id} onDone={() => setIsCreating(false)} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>施設一覧</Text>
        <Text style={styles.email}>{session.user.email}</Text>
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <View style={styles.actionRow}>
          <PrimaryButton label="施設を登録" onPress={() => setIsCreating(true)} />
          <PrimaryButton label="ログアウト" onPress={() => signOut()} loading={loading} />
        </View>
        <View style={styles.tabRow}>
          <ViewModeTab label="一覧" active={viewMode === 'list'} onPress={() => setViewMode('list')} />
          <ViewModeTab label="地図" active={viewMode === 'map'} onPress={() => setViewMode('map')} />
        </View>
      </View>
      {viewMode === 'list' ? <FacilityList /> : <NearbyMapScreen />}
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
    <Pressable style={[styles.tab, active ? styles.tabActive : null]} onPress={onPress}>
      <Text style={[styles.tabText, active ? styles.tabTextActive : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#5a5a5a',
    marginBottom: 12,
  },
  error: {
    color: '#d92d20',
    fontSize: 14,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  tabActive: {
    backgroundColor: '#2563eb',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5a5a5a',
  },
  tabTextActive: {
    color: '#fff',
  },
});
