import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useConfirmSpot, type PendingConfirmation } from '../hooks/useConfirmSpot';
import type { MyConfirmation } from '../hooks/useMyConfirmations';

interface ConfirmationButtonsProps {
  spotId: string;
  userId: string | null;
  confirmedCount: number;
  disputedCount: number;
  myConfirmation?: MyConfirmation;
  onRequireLogin: (pending: PendingConfirmation) => void;
}

export function ConfirmationButtons({
  spotId,
  userId,
  confirmedCount,
  disputedCount,
  myConfirmation,
  onRequireLogin,
}: ConfirmationButtonsProps) {
  const [comment, setComment] = useState('');
  const { mutate, isPending, error } = useConfirmSpot();

  const hasUnsavedComment = comment.trim() !== '';

  const handleVote = (isAccurate: boolean) => {
    if (!userId) {
      onRequireLogin({ spotId, isAccurate, comment: comment.trim() });
      return;
    }

    mutate(
      { spotId, userId, isAccurate, comment: comment.trim() },
      { onSuccess: () => setComment('') }
    );
  };

  return (
    <View className="mt-3 border-t border-[#e5e5e5] pt-3">
      <Text className="mb-2 text-[12px] text-[#5a5a5a]">この情報は合っていましたか？</Text>
      <View className="mb-2 flex-row gap-2">
        <Pressable
          className={`rounded-lg px-3 py-1.5 ${
            myConfirmation?.isAccurate === true ? 'bg-[#e7f6ec]' : 'bg-[#f2f2f2]'
          }`}
          onPress={() => handleVote(true)}
          disabled={isPending}
        >
          <Text className="text-[13px] font-semibold text-[#1a1a1a]">👍 {confirmedCount}</Text>
        </Pressable>
        <Pressable
          className={`rounded-lg px-3 py-1.5 ${
            myConfirmation?.isAccurate === false ? 'bg-[#fdeaea]' : 'bg-[#f2f2f2]'
          }`}
          onPress={() => handleVote(false)}
          disabled={isPending}
        >
          <Text className="text-[13px] font-semibold text-[#1a1a1a]">👎 {disputedCount}</Text>
        </Pressable>
      </View>
      <TextInput
        className="rounded-lg border border-[#d0d0d0] px-2.5 py-1.5 text-[13px]"
        placeholder="コメント（任意）"
        value={comment}
        onChangeText={setComment}
        editable={!isPending}
      />
      {hasUnsavedComment ? (
        <Text className="mt-1.5 text-[11px] text-[#a15c07]">
          👍か👎を押すと、このコメントが送信されます
        </Text>
      ) : null}
      {error ? <Text className="mt-1.5 text-[11px] text-[#d92d20]">{error.message}</Text> : null}
    </View>
  );
}
