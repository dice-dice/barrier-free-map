import type { Session } from '@supabase/supabase-js';
import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { useSignOut } from '../hooks/useSignOut';

interface MainScreenProps {
  session: Session;
}

export function MainScreen({ session }: MainScreenProps) {
  const { signOut, loading, errorMessage } = useSignOut();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>メイン画面</Text>
      <Text style={styles.email}>{session.user.email}</Text>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <PrimaryButton label="ログアウト" onPress={() => signOut()} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  email: {
    fontSize: 14,
    color: '#5a5a5a',
    marginBottom: 24,
  },
  error: {
    color: '#d92d20',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
});
