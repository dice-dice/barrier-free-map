import { StyleSheet, Text, View } from 'react-native';

export function NearbyMapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>地図はモバイルアプリでご利用いただけます</Text>
      <Text style={styles.description}>
        地図機能は現在iOS/Androidアプリでのみ対応しています。Web版では「一覧」タブから施設をご確認ください。
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#5a5a5a',
    textAlign: 'center',
  },
});
