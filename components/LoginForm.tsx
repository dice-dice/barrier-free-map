import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSignIn } from '../hooks/useSignIn';
import { isValidEmail, isValidPassword } from '../lib/validation';
import { AuthTextInput } from './AuthTextInput';
import { PrimaryButton } from './PrimaryButton';

interface FieldErrors {
  email?: string;
  password?: string;
}

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const { signIn, loading, errorMessage, setErrorMessage } = useSignIn();

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

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    setErrorMessage(null);

    if (!validate()) {
      return;
    }

    const success = await signIn({ email: email.trim(), password });

    if (success) {
      onSuccess?.();
    }
  };

  return (
    <View style={styles.container}>
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
      {errorMessage ? <Text style={styles.formError}>{errorMessage}</Text> : null}
      <PrimaryButton label="ログイン" onPress={handleSubmit} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  formError: {
    color: '#d92d20',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
});
