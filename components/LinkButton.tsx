import { Pressable, StyleSheet, Text } from 'react-native';

interface LinkButtonProps {
  label: string;
  onPress: () => void;
}

export function LinkButton({ label, onPress }: LinkButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
  },
  label: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
});
