import { Alert, Linking, Modal, Pressable, Text, View } from 'react-native';

const SUPPORT_EMAIL = 'daisuke.hatakeyama@spire-ad.jp';

async function openMailto(subject: string, body?: string) {
  const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}${
    body ? `&body=${encodeURIComponent(body)}` : ''
  }`;
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('メールアプリが見つかりません', 'メールアプリをインストールしてから再度お試しください。');
  }
}

interface SettingsMenuProps {
  visible: boolean;
  onClose: () => void;
  userEmail: string | null;
  onSelectProfile: () => void;
  onSelectPrivacyPolicy: () => void;
  onSelectTerms: () => void;
}

export function SettingsMenu({
  visible,
  onClose,
  userEmail,
  onSelectProfile,
  onSelectPrivacyPolicy,
  onSelectTerms,
}: SettingsMenuProps) {
  const openContactEmail = () => {
    onClose();
    openMailto('【バリアフリーマップ】お問い合わせ');
  };

  const requestAccountDeletion = () => {
    onClose();
    Alert.alert(
      'アカウント削除',
      'アカウント削除を希望する旨のメールを作成します。送信いただき次第、運営にて削除処理を行います。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'メールを作成',
          onPress: () => {
            const body = userEmail ? `削除を希望するアカウント: ${userEmail}` : undefined;
            openMailto('【バリアフリーマップ】アカウント削除希望', body);
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1" onPress={onClose}>
        <View className="items-end px-4 pt-14">
          <View className="w-56 overflow-hidden rounded-lg bg-white shadow-lg" style={{ elevation: 4 }}>
            {userEmail ? (
              <>
                <MenuItem label="プロフィール" onPress={onSelectProfile} />
                <Separator />
              </>
            ) : null}
            <MenuItem label="プライバシーポリシー" onPress={onSelectPrivacyPolicy} />
            <Separator />
            <MenuItem label="利用規約" onPress={onSelectTerms} />
            <Separator />
            <MenuItem label="メールでのお問い合わせ" onPress={openContactEmail} />
            {userEmail ? (
              <>
                <Separator />
                <MenuItem label="アカウント削除" onPress={requestAccountDeletion} destructive />
              </>
            ) : null}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

function Separator() {
  return <View className="h-[1px] bg-[#eeeeee]" />;
}

interface MenuItemProps {
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

function MenuItem({ label, onPress, destructive }: MenuItemProps) {
  return (
    <Pressable onPress={onPress} className="px-4 py-3">
      <Text className={`text-[14px] ${destructive ? 'text-[#d92d20]' : 'text-[#1a1a1a]'}`}>{label}</Text>
    </Pressable>
  );
}
