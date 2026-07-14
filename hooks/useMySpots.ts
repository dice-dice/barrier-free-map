import { useQuery } from '@tanstack/react-query';
import type { SpotStatus } from '../lib/database.types';
import { supabase } from '../lib/supabase';

export interface MySpot {
  id: string;
  name: string;
  status: SpotStatus;
  createdAt: string;
}

async function fetchMySpots(userId: string): Promise<MySpot[]> {
  const { data, error } = await supabase
    .from('spots')
    .select('id, name, status, created_at')
    .eq('created_by', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    status: row.status,
    createdAt: row.created_at,
  }));
}

export function useMySpots(userId: string | null) {
  const { data, isLoading } = useQuery({
    queryKey: ['mySpots', userId],
    queryFn: () => fetchMySpots(userId as string),
    enabled: userId !== null,
  });

  return { mySpots: data ?? [], loading: isLoading };
}
