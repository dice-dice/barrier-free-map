import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface SpotComment {
  id: string;
  isAccurate: boolean;
  comment: string;
  createdAt: string;
}

async function fetchPublicComments(): Promise<Record<string, SpotComment[]>> {
  const { data, error } = await supabase
    .from('spot_confirmations')
    .select('id, spot_id, is_accurate, comment, created_at')
    .not('comment', 'is', null)
    .neq('comment', '')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const result: Record<string, SpotComment[]> = {};
  for (const row of data) {
    if (!row.comment) {
      continue;
    }

    const list = result[row.spot_id] ?? [];
    list.push({
      id: row.id,
      isAccurate: row.is_accurate,
      comment: row.comment,
      createdAt: row.created_at,
    });
    result[row.spot_id] = list;
  }
  return result;
}

export function usePublicComments() {
  const { data } = useQuery({
    queryKey: ['publicComments'],
    queryFn: fetchPublicComments,
  });

  return data ?? {};
}
