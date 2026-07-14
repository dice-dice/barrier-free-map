import { Text, TextInput, TextInputProps, View } from 'react-native';

interface AuthTextInputProps extends TextInputProps {
  label: string;
  errorMessage?: string;
}

export function AuthTextInput({ label, errorMessage, ...rest }: AuthTextInputProps) {
  return (
    <View className="mb-4">
      <Text className="mb-1.5 text-[14px] font-semibold text-[#1a1a1a]">{label}</Text>
      <TextInput
        className={`rounded-lg border bg-white px-3 py-2.5 text-[16px] ${
          errorMessage ? 'border-[#d92d20]' : 'border-[#d0d0d0]'
        }`}
        placeholderTextColor="#9a9a9a"
        {...rest}
      />
      {errorMessage ? <Text className="mt-1 text-[13px] text-[#d92d20]">{errorMessage}</Text> : null}
    </View>
  );
}
