import { Image, ScrollView, StyleSheet } from 'react-native';

interface FacilityPhotoGalleryProps {
  photoUrls: string[];
}

export function FacilityPhotoGallery({ photoUrls }: FacilityPhotoGalleryProps) {
  if (photoUrls.length === 0) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {photoUrls.map((url, index) => (
        <Image key={`${url}-${index}`} source={{ uri: url }} style={styles.photo} resizeMode="cover" />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  content: {
    gap: 8,
  },
  photo: {
    width: 120,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },
});
