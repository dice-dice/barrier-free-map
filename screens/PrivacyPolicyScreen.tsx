import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { LinkButton } from '../components/LinkButton';

interface PrivacyPolicyScreenProps {
  onDone: () => void;
}

export function PrivacyPolicyScreen({ onDone }: PrivacyPolicyScreenProps) {
  return (
    <View className="flex-1 bg-white">
      <View className="px-6 pb-4 pt-6">
        <LinkButton label="← 戻る" onPress={onDone} />
        <Text className="mt-4 text-[20px] font-semibold text-[#1a1a1a]">プライバシーポリシー</Text>
      </View>
      <ScrollView contentContainerClassName="px-6 pb-10">
        <Article>
          本アプリ「バリアフリーマップ」（以下「本サービス」）における、利用者情報の取り扱いについて説明します。
        </Article>

        <Article title="1. 収集する情報">
          本サービスは、以下の情報を取得することがあります。{'\n'}
          ・メールアドレス（アカウント登録時）{'\n'}
          ・位置情報（現在地の表示、施設の登録のため）{'\n'}
          ・投稿していただいた施設情報・コメント等
        </Article>

        <Article title="2. 利用目的">
          取得した情報は、以下の目的で利用します。{'\n'}
          ・アカウントの認証・管理{'\n'}
          ・施設情報の登録・地図表示{'\n'}
          ・不正投稿・スパムの防止{'\n'}
          ・不具合発生時の原因調査
        </Article>

        <Article title="3. 第三者サービスの利用">
          本サービスは、以下の外部サービスを利用しています。それぞれの事業者のプライバシーポリシーが適用される場合があります。{'\n'}
          ・Supabase（データベース・認証基盤）{'\n'}
          ・Sentry（エラー・クラッシュの監視）{'\n'}
          ・Google Maps Platform（地図の表示）{'\n'}
          ・OpenStreetMap（施設データの一部、ODbLライセンス）
        </Article>

        <Article title="4. 情報の第三者提供">
          法令に基づく場合を除き、取得した情報を本人の同意なく第三者に提供することはありません。ただし、投稿された施設情報・コメントは、本サービスの性質上、他の利用者に公開されます。
        </Article>

        <Article title="5. 情報の管理">
          取得した情報は、適切な範囲で管理し、不正アクセスや漏えいの防止に努めます。
        </Article>

        <Article title="6. ユーザーの権利">
          アカウントの削除や、登録した情報の確認・修正を希望される場合は、アプリ内の操作、またはお問い合わせ先までご連絡ください。
        </Article>

        <Article title="7. 未成年者の利用について">
          未成年の方がご利用になる場合は、保護者の同意を得たうえでご利用ください。
        </Article>

        <Article title="8. プライバシーポリシーの変更">
          本ポリシーの内容は、必要に応じて予告なく変更されることがあります。変更後の内容は、本画面にて公表した時点から効力を持つものとします。
        </Article>

        <Text className="mt-6 text-[12px] text-[#9a9a9a]">制定日: 2026年7月23日</Text>
      </ScrollView>
    </View>
  );
}

interface ArticleProps {
  title?: string;
  children: ReactNode;
}

function Article({ title, children }: ArticleProps) {
  return (
    <View className="mb-4">
      {title ? <Text className="mb-1 text-[14px] font-semibold text-[#1a1a1a]">{title}</Text> : null}
      <Text className="text-[13px] leading-5 text-[#3a3a3a]">{children}</Text>
    </View>
  );
}
