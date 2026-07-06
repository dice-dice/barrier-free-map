import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface AuthTextInputProps extends TextInputProps {
  label: string;
  errorMessage?: string;
}

export function AuthTextInput({ label, errorMessage, style, ...rest }: AuthTextInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, errorMessage ? styles.inputError : null, style]}
        placeholderTextColor="#9a9a9a"
        {...rest}
      />
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#1a1a1a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#d92d20',
  },
  errorText: {
    marginTop: 4,
    color: '#d92d20',
    fontSize: 13,
  },
});
