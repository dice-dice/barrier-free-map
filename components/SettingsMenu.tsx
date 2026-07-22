import { Modal, Pressable, Text, View } from 'react-native';

interface SettingsMenuProps {
  visible: boolean;
  onClose: () => void;
  onSelectPrivacyPolicy: () => void;
  onSelectTerms: () => void;
}

export function SettingsMenu({ visible, onClose, onSelectPrivacyPolicy, onSelectTerms }: SettingsMenuProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1" onPress={onClose}>
        <View className="items-end px-4 pt-14">
          <View className="w-52 overflow-hidden rounded-lg bg-white shadow-lg" style={{ elevation: 4 }}>
            <MenuItem label="プライバシーポリシー" onPress={onSelectPrivacyPolicy} />
            <View className="h-[1px] bg-[#eeeeee]" />
            <MenuItem label="利用規約" onPress={onSelectTerms} />
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

interface MenuItemProps {
  label: string;
  onPress: () => void;
}

function MenuItem({ label, onPress }: MenuItemProps) {
  return (
    <Pressable onPress={onPress} className="px-4 py-3">
      <Text className="text-[14px] text-[#1a1a1a]">{label}</Text>
    </Pressable>
  );
}
