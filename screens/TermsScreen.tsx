import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { LinkButton } from '../components/LinkButton';

interface TermsScreenProps {
  onDone: () => void;
}

export function TermsScreen({ onDone }: TermsScreenProps) {
  return (
    <View className="flex-1 bg-white">
      <View className="px-6 pb-4 pt-6">
        <LinkButton label="← 戻る" onPress={onDone} />
        <Text className="mt-4 text-[20px] font-semibold text-[#1a1a1a]">利用規約・免責事項</Text>
      </View>
      <ScrollView contentContainerClassName="px-6 pb-10">
        <SectionTitle>利用規約</SectionTitle>

        <Article title="第1条（本規約について）">
          本規約は、本アプリ「バリアフリーマップ」（以下「本サービス」）の利用条件を定めるものです。ユーザーは、本サービスを利用することにより、本規約に同意したものとみなします。
        </Article>

        <Article title="第2条（サービス内容）">
          本サービスは、ユーザーが投稿した情報をもとに、バリアフリー関連施設の情報を共有するサービスです。掲載情報には、OpenStreetMapのデータ（オープンデータ、ODbLライセンス）を含みます。
        </Article>

        <Article title="第3条（禁止事項）">
          ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません。{'\n'}
          ・虚偽の情報を投稿する行為{'\n'}
          ・第三者の権利を侵害する行為{'\n'}
          ・本サービスの運営を妨げる行為{'\n'}
          ・法令に違反する行為{'\n'}
          ・その他、運営者が不適切と判断する行為
        </Article>

        <Article title="第4条（投稿コンテンツの取り扱い）">
          ユーザーが投稿した施設情報・コメント等は、本サービス内で公開されます。ユーザーは、投稿内容について、本サービスが必要な範囲で利用・表示することを許諾するものとします。
        </Article>

        <Article title="第5条（アカウントの停止等）">
          運営者は、ユーザーが本規約に違反したと判断した場合、事前の通知なく投稿の削除・アカウントの利用停止を行うことがあります。
        </Article>

        <Article title="第6条（サービスの変更・終了）">
          運営者は、事前の通知なく本サービスの内容を変更、または提供を終了することができるものとします。
        </Article>

        <Article title="第7条（準拠法）">本規約の解釈にあたっては、日本法を準拠法とします。</Article>

        <SectionTitle>免責事項</SectionTitle>

        <Article>
          ・本サービスに掲載されている施設情報（バリアフリー対応状況等）は、ユーザーによる投稿およびOpenStreetMapのデータをもとにしており、その正確性・最新性を保証するものではありません。{'\n'}
          ・実際にご利用の際は、事前に施設への直接確認をお願いいたします。{'\n'}
          ・本サービスの情報を利用したことにより生じたいかなる損害についても、運営者は責任を負いかねます。{'\n'}
          ・本サービスは個人による開発・運営であり、常時の保守・サポートを保証するものではありません。
        </Article>

        <Text className="mt-6 text-[12px] text-[#9a9a9a]">制定日: 2026年7月17日</Text>
      </ScrollView>
    </View>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <Text className="mb-3 mt-2 text-[18px] font-bold text-[#1a1a1a]">{children}</Text>;
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
