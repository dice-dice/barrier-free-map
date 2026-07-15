import { Pressable, Text, View } from 'react-native';
import type { SpotComment } from '../hooks/usePublicComments';

interface SpotCommentsProps {
  comments: SpotComment[];
  isAdmin?: boolean;
  onDeleteComment?: (commentId: string) => void;
}

const VISIBLE_COMMENT_COUNT = 3;

export function SpotComments({ comments, isAdmin, onDeleteComment }: SpotCommentsProps) {
  if (comments.length === 0) {
    return null;
  }

  const visibleComments = comments.slice(0, VISIBLE_COMMENT_COUNT);
  const remainingCount = comments.length - visibleComments.length;

  return (
    <View className="mt-3 gap-2">
      <Text className="text-[12px] font-semibold text-[#5a5a5a]">みんなのコメント</Text>
      {visibleComments.map((item) => (
        <View
          key={item.id}
          className="flex-row items-center justify-between rounded-lg bg-[#f7f7f7] px-3 py-2"
        >
          <Text className="flex-1 text-[13px] text-[#1a1a1a]">
            {item.isAccurate ? '👍' : '👎'} {item.comment}
          </Text>
          {isAdmin ? (
            <Pressable onPress={() => onDeleteComment?.(item.id)} className="ml-2 px-1">
              <Text className="text-[12px] text-[#d92d20]">削除</Text>
            </Pressable>
          ) : null}
        </View>
      ))}
      {remainingCount > 0 ? (
        <Text className="text-[11px] text-[#9a9a9a]">他{remainingCount}件のコメント</Text>
      ) : null}
    </View>
  );
}
