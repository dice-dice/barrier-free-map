import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { LinkButton } from '../components/LinkButton';
import { useMySpots } from '../hooks/useMySpots';

interface MySubmissionsScreenProps {
  userId: string;
  onDone: () => void;
}

export function MySubmissionsScreen({ userId, onDone }: MySubmissionsScreenProps) {
  const { mySpots, loading } = useMySpots(userId);

  return (
    <View className="flex-1 bg-white">
      <View className="px-6 pb-4 pt-6">
        <LinkButton label="← 一覧に戻る" onPress={onDone} />
        <Text className="mt-4 text-[20px] font-semibold text-[#1a1a1a]">マイ投稿</Text>
      </View>
      {loading ? (
        <View className="flex-1 items-center justify-center px-6">
          <ActivityIndicator size="large" />
        </View>
      ) : mySpots.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-[14px] text-[#5a5a5a]">まだ投稿がありません</Text>
        </View>
      ) : (
        <ScrollView contentContainerClassName="px-6 pb-6">
          {mySpots.map((spot) => (
            <View key={spot.id} className="mb-3 flex-row items-center justify-between rounded-xl border border-[#e5e5e5] p-4">
              <Text className="flex-1 text-[15px] font-semibold text-[#1a1a1a]">{spot.name}</Text>
              {spot.status === 'approved' ? (
                <View className="rounded-full bg-[#e7f6ec] px-3 py-1">
                  <Text className="text-[12px] font-semibold text-[#1a7f37]">公開中</Text>
                </View>
              ) : (
                <View className="rounded-full bg-[#f2f2f2] px-3 py-1">
                  <Text className="text-[12px] font-semibold text-[#5a5a5a]">審査中</Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
