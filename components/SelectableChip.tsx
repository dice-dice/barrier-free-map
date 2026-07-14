import { Pressable, Text } from 'react-native';

interface SelectableChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function SelectableChip({ label, selected, onPress }: SelectableChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full px-3.5 py-2 ${selected ? 'bg-blue-600' : 'bg-[#f2f2f2]'}`}
    >
      <Text className={`text-[13px] font-semibold ${selected ? 'text-white' : 'text-[#5a5a5a]'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
