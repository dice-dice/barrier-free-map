import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useConfirmSpot } from '../hooks/useConfirmSpot';
import type { MyConfirmation } from '../hooks/useMyConfirmations';

interface ConfirmationButtonsProps {
  spotId: string;
  userId: string;
  confirmedCount: number;
  disputedCount: number;
  myConfirmation?: MyConfirmation;
}

export function ConfirmationButtons({
  spotId,
  userId,
  confirmedCount,
  disputedCount,
  myConfirmation,
}: ConfirmationButtonsProps) {
  const [comment, setComment] = useState(myConfirmation?.comment ?? '');
  const { mutate, isPending } = useConfirmSpot();

  const handleVote = (isAccurate: boolean) => {
    mutate({ spotId, userId, isAccurate, comment: comment.trim() });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>この情報は合っていましたか？</Text>
      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.voteButton, myConfirmation?.isAccurate === true ? styles.voteButtonActiveGood : null]}
          onPress={() => handleVote(true)}
          disabled={isPending}
        >
          <Text style={styles.voteButtonText}>👍 {confirmedCount}</Text>
        </Pressable>
        <Pressable
          style={[styles.voteButton, myConfirmation?.isAccurate === false ? styles.voteButtonActiveBad : null]}
          onPress={() => handleVote(false)}
          disabled={isPending}
        >
          <Text style={styles.voteButtonText}>👎 {disputedCount}</Text>
        </Pressable>
      </View>
      <TextInput
        style={styles.commentInput}
        placeholder="コメント（任意）"
        value={comment}
        onChangeText={setComment}
        editable={!isPending}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  question: {
    fontSize: 12,
    color: '#5a5a5a',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  voteButton: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f2f2f2',
  },
  voteButtonActiveGood: {
    backgroundColor: '#e7f6ec',
  },
  voteButtonActiveBad: {
    backgroundColor: '#fdeaea',
  },
  voteButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
  },
});
