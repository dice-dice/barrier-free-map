import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { AuthTextInput } from '../components/AuthTextInput';
import { LinkButton } from '../components/LinkButton';
import { PrimaryButton } from '../components/PrimaryButton';
import { useProfile, useUpdateProfile } from '../hooks/useProfile';

interface ProfileScreenProps {
  userId: string;
  onDone: () => void;
}

export function ProfileScreen({ userId, onDone }: ProfileScreenProps) {
  const { data: profile, isLoading } = useProfile(userId);
  const { mutate: updateProfile, isPending, isSuccess, error } = useUpdateProfile();
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
    }
  }, [profile]);

  return (
    <KeyboardAvoidingView className="flex-1 bg-white" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerClassName="flex-grow px-6 pb-10 pt-6" keyboardShouldPersistTaps="handled">
        <LinkButton label="← 戻る" onPress={onDone} />
        <Text className="mb-6 mt-4 text-[20px] font-semibold text-[#1a1a1a]">プロフィール</Text>
        {isLoading ? (
          <Text className="text-[14px] text-[#5a5a5a]">読み込み中...</Text>
        ) : (
          <>
            <AuthTextInput
              label="表示名"
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="例: 山田太郎"
              editable={!isPending}
            />
            {error ? <Text className="mb-3 text-[13px] text-[#d92d20]">{error.message}</Text> : null}
            {isSuccess ? <Text className="mb-3 text-[13px] text-[#12805c]">保存しました</Text> : null}
            <PrimaryButton
              label="保存"
              loading={isPending}
              disabled={displayName.trim().length === 0}
              onPress={() => updateProfile({ userId, displayName: displayName.trim() })}
            />
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
