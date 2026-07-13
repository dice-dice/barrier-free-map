import { StyleSheet, Text } from 'react-native';

export function OsmAttribution() {
  return (
    <Text style={styles.text}>
      一部の施設データは © OpenStreetMap contributors（ODbLライセンス）を含みます
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 11,
    color: '#9a9a9a',
    textAlign: 'center',
    paddingVertical: 16,
  },
});
