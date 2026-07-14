import './global.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { useSession } from './hooks/useSession';
import { queryClient } from './lib/queryClient';
import { AuthScreen } from './screens/AuthScreen';
import { MainScreen } from './screens/MainScreen';

export default function App() {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      {session ? <MainScreen session={session} /> : <AuthScreen />}
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}
