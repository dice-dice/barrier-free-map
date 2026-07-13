import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import type { MyConfirmation } from '../hooks/useMyConfirmations';
import type { FacilityListItem as FacilityListItemData } from '../lib/facilityDisplay';
import { ConfirmationButtons } from './ConfirmationButtons';
import { FacilityPhotoGallery } from './FacilityPhotoGallery';

interface FacilityListItemProps {
  facility: FacilityListItemData;
  userId: string;
  myConfirmation?: MyConfirmation;
}

export function FacilityListItem({ facility, userId, myConfirmation }: FacilityListItemProps) {
  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${facility.latitude},${facility.longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.card}>
      <FacilityPhotoGallery photoUrls={facility.photoUrls} />
      {facility.isUnverifiedImport ? (
        <View style={styles.unverifiedBadge}>
          <Text style={styles.unverifiedBadgeText}>OpenStreetMap由来・未確認</Text>
        </View>
      ) : null}
      <Text style={styles.name}>{facility.name}</Text>
      {facility.address ? <Text style={styles.address}>{facility.address}</Text> : null}
      <View style={styles.badgeRow}>
        <FeatureBadge label="車椅子対応" active={facility.isWheelchairAccessible} />
        <FeatureBadge label="多目的トイレ" active={facility.hasAccessibleToilet} />
        <FeatureBadge label="エレベーター" active={facility.hasElevator} />
      </View>
      <Pressable onPress={openInGoogleMaps} style={styles.mapLink}>
        <Text style={styles.mapLinkText}>Googleマップで開く</Text>
      </Pressable>
      <ConfirmationButtons
        spotId={facility.id}
        userId={userId}
        confirmedCount={facility.confirmedCount}
        disputedCount={facility.disputedCount}
        myConfirmation={myConfirmation}
      />
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
  unverifiedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fdf0d5',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 8,
  },
  unverifiedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#a15c07',
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
  mapLink: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  mapLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563eb',
  },
});
