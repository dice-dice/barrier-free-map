import { Pressable, StyleSheet, Text } from 'react-native';

interface SelectableChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function SelectableChip({ label, selected, onPress }: SelectableChipProps) {
  return (
    <Pressable style={[styles.chip, selected ? styles.chipSelected : null]} onPress={onPress}>
      <Text style={[styles.label, selected ? styles.labelSelected : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#f2f2f2',
  },
  chipSelected: {
    backgroundColor: '#2563eb',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5a5a5a',
  },
  labelSelected: {
    color: '#fff',
  },
});
