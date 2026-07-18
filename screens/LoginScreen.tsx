import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { LinkButton } from '../components/LinkButton';
import { LoginForm } from '../components/LoginForm';

interface LoginScreenProps {
  onNavigateToSignup: () => void;
  onShowTerms: () => void;
}

export function LoginScreen({ onNavigateToSignup, onShowTerms }: LoginScreenProps) {
  return (
    <KeyboardAvoidingView className="flex-1 bg-white" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerClassName="flex-grow justify-center px-6" keyboardShouldPersistTaps="handled">
        <View className="mb-8">
          <Text className="mb-2 text-[28px] font-bold text-[#1a1a1a]">ログイン</Text>
          <Text className="text-[14px] text-[#5a5a5a]">登録済みのメールアドレスでログインしてください</Text>
        </View>
        <LoginForm />
        <LinkButton label="アカウントをお持ちでない方はこちら" onPress={onNavigateToSignup} />
        <Text className="mt-6 text-center text-[12px] text-[#9a9a9a]">
          ご利用いただくことで、
          <Text className="text-[12px] font-semibold text-blue-600" onPress={onShowTerms}>
            利用規約・免責事項
          </Text>
          に同意したものとみなします
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
