import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
}

export function FacilityForm({ createdBy, onSuccess }: FacilityFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState<SpotCategory>('other');
  const [accessibilityFeatures, setAccessibilityFeatures] = useState<string[]>([]);
  const [nameError, setNameError] = useState<string | undefined>();

  const { coordinates, loading: locationLoading, errorMessage: locationError } = useCurrentLocation();
  const { mutate, isPending, error } = useCreateFacility();

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
      { onSuccess }
    );
  };

  const canSubmit = !locationLoading && coordinates !== null && !isPending;

  return (
    <View style={styles.container}>
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

      <Text style={styles.sectionLabel}>カテゴリ</Text>
      <View style={styles.chipRow}>
        {CATEGORY_OPTIONS.map((option) => (
          <SelectableChip
            key={option.value}
            label={option.label}
            selected={category === option.value}
            onPress={() => setCategory(option.value)}
          />
        ))}
      </View>

      <Text style={styles.sectionLabel}>バリアフリー情報</Text>
      <View style={styles.chipRow}>
        {ACCESSIBILITY_FEATURE_OPTIONS.map((option) => (
          <SelectableChip
            key={option.tag}
            label={option.label}
            selected={accessibilityFeatures.includes(option.tag)}
            onPress={() => toggleFeature(option.tag)}
          />
        ))}
      </View>

      <Text style={styles.sectionLabel}>位置情報</Text>
      {locationLoading ? (
        <Text style={styles.locationText}>現在地を取得中です...</Text>
      ) : locationError || !coordinates ? (
        <Text style={styles.errorText}>{locationError ?? '現在地を取得できませんでした'}</Text>
      ) : (
        <Text style={styles.locationText}>
          現在地を施設の位置として登録します（緯度 {coordinates.latitude.toFixed(5)} / 経度{' '}
          {coordinates.longitude.toFixed(5)}）
        </Text>
      )}

      {error ? <Text style={styles.errorText}>{error.message}</Text> : null}

      <PrimaryButton label="登録する" onPress={handleSubmit} loading={isPending} disabled={!canSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  locationText: {
    fontSize: 13,
    color: '#5a5a5a',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 13,
    color: '#d92d20',
    marginBottom: 20,
  },
});
