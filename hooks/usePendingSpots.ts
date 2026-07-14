import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface PendingSpot {
  id: string;
  name: string;
  address: string | null;
  category: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

async function fetchPendingSpots(): Promise<PendingSpot[]> {
  const { data, error } = await supabase.rpc('get_pending_spots');

  if (error) {
    throw new Error(error.message);
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    address: row.address,
    category: row.category,
    latitude: row.latitude,
    longitude: row.longitude,
    createdAt: row.created_at,
  }));
}

export function usePendingSpots(enabled: boolean) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['pendingSpots'],
    queryFn: fetchPendingSpots,
    enabled,
  });

  return {
    pendingSpots: data ?? [],
    loading: isLoading,
    errorMessage: error instanceof Error ? error.message : null,
  };
}
