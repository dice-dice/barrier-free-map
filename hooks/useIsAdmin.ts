import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

async function fetchIsAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase.from('profiles').select('is_admin').eq('id', userId).single();

  if (error) {
    throw new Error(error.message);
  }

  return data.is_admin;
}

export function useIsAdmin(userId: string | null) {
  const { data } = useQuery({
    queryKey: ['isAdmin', userId],
    queryFn: () => fetchIsAdmin(userId as string),
    enabled: userId !== null,
  });

  return data ?? false;
}
