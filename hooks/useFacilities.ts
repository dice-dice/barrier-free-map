import { useEffect, useState } from 'react';
import { toFacilityListItem, type FacilityListItem } from '../lib/facilityDisplay';
import { supabase } from '../lib/supabase';

export function useFacilities() {
  const [facilities, setFacilities] = useState<FacilityListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    supabase
      .from('spots')
      .select('id, name, address, category, accessibility_features, photo_urls')
      .order('name', { ascending: true })
      .then(({ data, error }) => {
        if (!isMounted) {
          return;
        }

        if (error) {
          setErrorMessage(error.message);
        } else {
          setFacilities(data.map(toFacilityListItem));
        }

        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { facilities, loading, errorMessage };
}
