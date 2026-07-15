import { useMutation } from '@tanstack/react-query';

const GSI_ADDRESS_SEARCH_URL = 'https://msearch.gsi.go.jp/address-search/AddressSearch';

export interface AddressSearchResult {
  title: string;
  latitude: number;
  longitude: number;
}

interface GsiAddressSearchFeature {
  geometry: {
    coordinates: [number, number];
  };
  properties: {
    title: string;
  };
}

async function searchAddress(query: string): Promise<AddressSearchResult[]> {
  const response = await fetch(`${GSI_ADDRESS_SEARCH_URL}?q=${encodeURIComponent(query)}`);

  if (!response.ok) {
    throw new Error('住所の検索に失敗しました');
  }

  const features: GsiAddressSearchFeature[] = await response.json();

  return features.map((feature) => ({
    title: feature.properties.title,
    longitude: feature.geometry.coordinates[0],
    latitude: feature.geometry.coordinates[1],
  }));
}

export function useAddressSearch() {
  const { mutate, mutateAsync, data, isPending, error, reset } = useMutation({
    mutationFn: searchAddress,
  });

  return {
    search: mutate,
    searchAsync: mutateAsync,
    results: data ?? [],
    loading: isPending,
    errorMessage: error instanceof Error ? error.message : null,
    reset,
  };
}
