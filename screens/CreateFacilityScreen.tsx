import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { FacilityForm } from '../components/FacilityForm';
import { LinkButton } from '../components/LinkButton';

interface CreateFacilityScreenProps {
  createdBy: string;
  onDone: () => void;
  location: { latitude: number; longitude: number };
}

export function CreateFacilityScreen({ createdBy, onDone, location }: CreateFacilityScreenProps) {
  return (
    <KeyboardAvoidingView className="flex-1 bg-white" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerClassName="flex-grow px-6 pb-10 pt-6" keyboardShouldPersistTaps="handled">
        <View className="mb-6">
          <Text className="mb-1.5 text-[24px] font-bold text-[#1a1a1a]">施設を登録</Text>
          <Text className="text-[14px] text-[#5a5a5a]">地図で選択した場所を施設として登録します</Text>
        </View>
        <FacilityForm createdBy={createdBy} onSuccess={onDone} location={location} />
        <LinkButton label="キャンセルして戻る" onPress={onDone} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
