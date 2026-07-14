import { Pressable, Text } from 'react-native';

interface LinkButtonProps {
  label: string;
  onPress: () => void;
}

export function LinkButton({ label, onPress }: LinkButtonProps) {
  return (
    <Pressable onPress={onPress} className="mt-5 items-center">
      <Text className="text-[14px] font-semibold text-blue-600">{label}</Text>
    </Pressable>
  );
}
