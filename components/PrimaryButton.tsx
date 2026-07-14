import { ActivityIndicator, GestureResponderEvent, Pressable, Text } from 'react-native';

interface PrimaryButtonProps {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  loading?: boolean;
  disabled?: boolean;
}

export function PrimaryButton({ label, onPress, loading, disabled }: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      className={`items-center justify-center rounded-lg py-3.5 active:opacity-85 ${
        isDisabled ? 'bg-[#93b4f0]' : 'bg-blue-600'
      }`}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className="text-[16px] font-semibold text-white">{label}</Text>
      )}
    </Pressable>
  );
}
