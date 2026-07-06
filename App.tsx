import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSession } from './hooks/useSession';
import { LoginScreen } from './screens/LoginScreen';
import { MainScreen } from './screens/MainScreen';

export default function App() {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <>
      {session ? <MainScreen /> : <LoginScreen />}
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
