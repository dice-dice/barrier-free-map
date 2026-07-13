import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { FacilityForm } from '../components/FacilityForm';
import { LinkButton } from '../components/LinkButton';

interface CreateFacilityScreenProps {
  createdBy: string;
  onDone: () => void;
}

export function CreateFacilityScreen({ createdBy, onDone }: CreateFacilityScreenProps) {
  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>施設を登録</Text>
          <Text style={styles.subtitle}>今いる場所を施設として登録します</Text>
        </View>
        <FacilityForm createdBy={createdBy} onSuccess={onDone} />
        <LinkButton label="キャンセルして戻る" onPress={onDone} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#5a5a5a',
  },
});
