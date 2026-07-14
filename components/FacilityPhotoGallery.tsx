import { Image, ScrollView } from 'react-native';

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
      className="mb-2.5"
      contentContainerClassName="gap-2"
    >
      {photoUrls.map((url, index) => (
        <Image
          key={`${url}-${index}`}
          source={{ uri: url }}
          className="h-[90px] w-[120px] rounded-lg bg-[#f2f2f2]"
          resizeMode="cover"
        />
      ))}
    </ScrollView>
  );
}
