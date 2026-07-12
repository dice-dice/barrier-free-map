import { StyleSheet, Text, View } from 'react-native';
import type { FacilityListItem as FacilityListItemData } from '../lib/facilityDisplay';
import { FacilityPhotoGallery } from './FacilityPhotoGallery';

interface FacilityListItemProps {
  facility: FacilityListItemData;
}

export function FacilityListItem({ facility }: FacilityListItemProps) {
  return (
    <View style={styles.card}>
      <FacilityPhotoGallery photoUrls={facility.photoUrls} />
      <Text style={styles.name}>{facility.name}</Text>
      {facility.address ? <Text style={styles.address}>{facility.address}</Text> : null}
      <View style={styles.badgeRow}>
        <FeatureBadge label="車椅子対応" active={facility.isWheelchairAccessible} />
        <FeatureBadge label="多目的トイレ" active={facility.hasAccessibleToilet} />
        <FeatureBadge label="エレベーター" active={facility.hasElevator} />
      </View>
    </View>
  );
}

interface FeatureBadgeProps {
  label: string;
  active: boolean;
}

function FeatureBadge({ label, active }: FeatureBadgeProps) {
  return (
    <View style={[styles.badge, active ? styles.badgeActive : styles.badgeInactive]}>
      <Text style={[styles.badgeText, active ? styles.badgeTextActive : styles.badgeTextInactive]}>
        {active ? `✓ ${label}` : label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  address: {
    fontSize: 13,
    color: '#5a5a5a',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeActive: {
    backgroundColor: '#e7f6ec',
  },
  badgeInactive: {
    backgroundColor: '#f2f2f2',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextActive: {
    color: '#1a7f37',
  },
  badgeTextInactive: {
    color: '#9a9a9a',
  },
});
