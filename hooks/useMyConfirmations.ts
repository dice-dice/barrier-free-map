import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface MyConfirmation {
  isAccurate: boolean;
  comment: string | null;
}

async function fetchMyConfirmations(userId: string): Promise<Record<string, MyConfirmation>> {
  const { data, error } = await supabase
    .from('spot_confirmations')
    .select('spot_id, is_accurate, comment')
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  const result: Record<string, MyConfirmation> = {};
  for (const row of data) {
    result[row.spot_id] = { isAccurate: row.is_accurate, comment: row.comment };
  }
  return result;
}

export function useMyConfirmations(userId: string | null) {
  const { data } = useQuery({
    queryKey: ['myConfirmations', userId],
    queryFn: () => fetchMyConfirmations(userId as string),
    enabled: userId !== null,
  });

  return data ?? {};
}
