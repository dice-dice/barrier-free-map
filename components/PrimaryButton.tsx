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
      className={`items-center justify-center rounded-lg border px-5 py-3.5 active:opacity-85 ${
        isDisabled ? 'border-blue-200 bg-blue-50' : 'border-blue-400 bg-blue-100'
      }`}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color="#1d4ed8" />
      ) : (
        <Text className={`text-[16px] font-semibold ${isDisabled ? 'text-blue-300' : 'text-blue-700'}`}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
