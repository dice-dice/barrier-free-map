import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { LinkButton } from '../components/LinkButton';
import { SignupForm } from '../components/SignupForm';

interface SignupScreenProps {
  onNavigateToLogin: () => void;
}

export function SignupScreen({ onNavigateToLogin }: SignupScreenProps) {
  return (
    <KeyboardAvoidingView className="flex-1 bg-white" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerClassName="flex-grow justify-center px-6" keyboardShouldPersistTaps="handled">
        <View className="mb-8">
          <Text className="mb-2 text-[28px] font-bold text-[#1a1a1a]">アカウント作成</Text>
          <Text className="text-[14px] text-[#5a5a5a]">メールアドレスとパスワードを入力してください</Text>
        </View>
        <SignupForm />
        <LinkButton label="すでにアカウントをお持ちの方はこちら" onPress={onNavigateToLogin} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
