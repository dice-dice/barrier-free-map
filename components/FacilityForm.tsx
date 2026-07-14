import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { useCreateFacility } from '../hooks/useCreateFacility';
import type { SpotCategory } from '../lib/database.types';
import { ACCESSIBILITY_FEATURE_OPTIONS, CATEGORY_OPTIONS } from '../lib/facilityOptions';
import { isValidFacilityName } from '../lib/facilityValidation';
import { AuthTextInput } from './AuthTextInput';
import { PrimaryButton } from './PrimaryButton';
import { SelectableChip } from './SelectableChip';

interface FacilityFormProps {
  createdBy: string;
  onSuccess: () => void;
  initialLocation?: { latitude: number; longitude: number } | null;
}

export function FacilityForm({ createdBy, onSuccess, initialLocation }: FacilityFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState<SpotCategory>('other');
  const [accessibilityFeatures, setAccessibilityFeatures] = useState<string[]>([]);
  const [nameError, setNameError] = useState<string | undefined>();

  const {
    coordinates: currentCoordinates,
    loading: locationLoading,
    errorMessage: locationError,
  } = useCurrentLocation();
  const { mutate, isPending, error } = useCreateFacility();

  const coordinates = initialLocation ?? currentCoordinates;
  const isUsingSelectedLocation = initialLocation != null;

  const toggleFeature = (tag: string) => {
    setAccessibilityFeatures((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]
    );
  };

  const handleSubmit = () => {
    if (!isValidFacilityName(name)) {
      setNameError('施設名を入力してください');
      return;
    }
    setNameError(undefined);

    if (!coordinates) {
      return;
    }

    mutate(
      {
        name: name.trim(),
        description: description.trim(),
        category,
        accessibilityFeatures,
        address: address.trim(),
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        createdBy,
      },
      {
        onSuccess: () => {
          Alert.alert('投稿ありがとうございます', '管理者の確認後に一覧・地図へ公開されます。', [
            { text: 'OK', onPress: onSuccess },
          ]);
        },
      }
    );
  };

  const canSubmit = isUsingSelectedLocation
    ? coordinates !== null && !isPending
    : !locationLoading && coordinates !== null && !isPending;

  return (
    <View className="w-full">
      <AuthTextInput
        label="施設名"
        value={name}
        onChangeText={setName}
        errorMessage={nameError}
        placeholder="例: 東京駅八重洲口"
        editable={!isPending}
      />
      <AuthTextInput
        label="説明（任意）"
        value={description}
        onChangeText={setDescription}
        placeholder="例: 車椅子対応のスロープ付き入口"
        multiline
        editable={!isPending}
      />
      <AuthTextInput
        label="住所（任意）"
        value={address}
        onChangeText={setAddress}
        placeholder="例: 東京都千代田区丸の内1丁目"
        editable={!isPending}
      />

      <Text className="mb-2 text-[14px] font-semibold text-[#1a1a1a]">カテゴリ</Text>
      <View className="mb-5 flex-row flex-wrap gap-2">
        {CATEGORY_OPTIONS.map((option) => (
          <SelectableChip
            key={option.value}
            label={option.label}
            selected={category === option.value}
            onPress={() => setCategory(option.value)}
          />
        ))}
      </View>

      <Text className="mb-2 text-[14px] font-semibold text-[#1a1a1a]">バリアフリー情報</Text>
      <View className="mb-5 flex-row flex-wrap gap-2">
        {ACCESSIBILITY_FEATURE_OPTIONS.map((option) => (
          <SelectableChip
            key={option.tag}
            label={option.label}
            selected={accessibilityFeatures.includes(option.tag)}
            onPress={() => toggleFeature(option.tag)}
          />
        ))}
      </View>

      <Text className="mb-2 text-[14px] font-semibold text-[#1a1a1a]">位置情報</Text>
      {isUsingSelectedLocation ? (
        <Text className="mb-5 text-[13px] text-[#5a5a5a]">
          地図で選択した地点を施設の位置として登録します（緯度 {coordinates!.latitude.toFixed(5)} / 経度{' '}
          {coordinates!.longitude.toFixed(5)}）
        </Text>
      ) : locationLoading ? (
        <Text className="mb-5 text-[13px] text-[#5a5a5a]">現在地を取得中です...</Text>
      ) : locationError || !coordinates ? (
        <Text className="mb-5 text-[13px] text-[#d92d20]">
          {locationError ?? '現在地を取得できませんでした'}
        </Text>
      ) : (
        <Text className="mb-5 text-[13px] text-[#5a5a5a]">
          現在地を施設の位置として登録します（緯度 {coordinates.latitude.toFixed(5)} / 経度{' '}
          {coordinates.longitude.toFixed(5)}）
        </Text>
      )}

      {error ? <Text className="mb-5 text-[13px] text-[#d92d20]">{error.message}</Text> : null}

      <PrimaryButton label="登録する" onPress={handleSubmit} loading={isPending} disabled={!canSubmit} />
    </View>
  );
}
