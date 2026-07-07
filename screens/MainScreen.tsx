import type { Session } from '@supabase/supabase-js';
import { StyleSheet, Text, View } from 'react-native';
import { FacilityList } from '../components/FacilityList';
import { PrimaryButton } from '../components/PrimaryButton';
import { useSignOut } from '../hooks/useSignOut';

interface MainScreenProps {
  session: Session;
}

export function MainScreen({ session }: MainScreenProps) {
  const { signOut, loading, errorMessage } = useSignOut();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>施設一覧</Text>
        <Text style={styles.email}>{session.user.email}</Text>
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <PrimaryButton label="ログアウト" onPress={() => signOut()} loading={loading} />
      </View>
      <FacilityList />
    </View>
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
});
