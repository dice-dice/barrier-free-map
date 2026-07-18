import { Text, View } from 'react-native';
import { PrimaryButton } from './PrimaryButton';

interface DisclaimerNoticeProps {
  onDismiss: () => void;
  onShowTerms: () => void;
}

export function DisclaimerNotice({ onDismiss, onShowTerms }: DisclaimerNoticeProps) {
  return (
    <View className="absolute inset-0 z-50 items-center justify-end bg-black/40 px-6 pb-8">
      <View className="w-full rounded-xl bg-white p-5">
        <Text className="mb-2 text-[16px] font-bold text-[#1a1a1a]">ご利用にあたって</Text>
        <Text className="mb-4 text-[13px] leading-5 text-[#3a3a3a]">
          本アプリのバリアフリー情報は、ユーザー投稿およびOpenStreetMapのデータに基づいており、正確性・最新性を保証するものではありません。実際のご利用の際は、事前に施設へ直接ご確認ください。
        </Text>
        <Text className="mb-4 text-[12px] font-semibold text-blue-600" onPress={onShowTerms}>
          利用規約・免責事項の全文を見る
        </Text>
        <PrimaryButton label="確認しました" onPress={onDismiss} />
      </View>
    </View>
  );
}
