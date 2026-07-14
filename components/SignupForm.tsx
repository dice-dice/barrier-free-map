import { useState } from 'react';
import { Text, View } from 'react-native';
import { useSignUp } from '../hooks/useSignUp';
import { isValidEmail, isValidPassword } from '../lib/validation';
import { AuthTextInput } from './AuthTextInput';
import { PrimaryButton } from './PrimaryButton';

interface FieldErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const { signUp, loading, errorMessage, setErrorMessage } = useSignUp();

  const validate = (): boolean => {
    const errors: FieldErrors = {};

    if (!email.trim()) {
      errors.email = 'メールアドレスを入力してください';
    } else if (!isValidEmail(email)) {
      errors.email = 'メールアドレスの形式が正しくありません';
    }

    if (!password) {
      errors.password = 'パスワードを入力してください';
    } else if (!isValidPassword(password)) {
      errors.password = 'パスワードは8文字以上で入力してください';
    }

    if (!confirmPassword) {
      errors.confirmPassword = '確認用パスワードを入力してください';
    } else if (confirmPassword !== password) {
      errors.confirmPassword = 'パスワードが一致しません';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    setInfoMessage(null);

    if (!validate()) {
      return;
    }

    const result = await signUp({ email: email.trim(), password });

    if (result?.requiresEmailConfirmation) {
      setInfoMessage('確認メールを送信しました。メール内のリンクから認証を完了してください。');
    }
  };

  return (
    <View className="w-full">
      <AuthTextInput
        label="メールアドレス"
        value={email}
        onChangeText={setEmail}
        errorMessage={fieldErrors.email}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        placeholder="you@example.com"
        editable={!loading}
      />
      <AuthTextInput
        label="パスワード"
        value={password}
        onChangeText={setPassword}
        errorMessage={fieldErrors.password}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
        placeholder="8文字以上"
        editable={!loading}
      />
      <AuthTextInput
        label="パスワード（確認）"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        errorMessage={fieldErrors.confirmPassword}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
        placeholder="もう一度入力してください"
        editable={!loading}
      />
      {errorMessage ? (
        <Text className="mb-3 text-center text-[14px] text-[#d92d20]">{errorMessage}</Text>
      ) : null}
      {infoMessage ? (
        <Text className="mb-3 text-center text-[14px] text-[#1a7f37]">{infoMessage}</Text>
      ) : null}
      <PrimaryButton label="アカウント作成" onPress={handleSubmit} loading={loading} />
    </View>
  );
}
