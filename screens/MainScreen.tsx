import { StyleSheet, Text, View } from 'react-native';

export function MainScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>メイン画面</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});
