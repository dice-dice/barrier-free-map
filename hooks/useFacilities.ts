import { useQuery } from '@tanstack/react-query';
import { toFacilityListItem, type FacilityListItem } from '../lib/facilityDisplay';
import { supabase } from '../lib/supabase';

async function fetchFacilities(): Promise<FacilityListItem[]> {
  const { data, error } = await supabase
    .from('spot_details')
    .select(
      'id, name, address, category, accessibility_features, photo_urls, source, latitude, longitude, confirmed_count, disputed_count'
    )
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data.map(toFacilityListItem);
}

export function useFacilities() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['facilities'],
    queryFn: fetchFacilities,
  });

  return {
    facilities: data ?? [],
    loading: isLoading,
    errorMessage: error instanceof Error ? error.message : null,
  };
}
