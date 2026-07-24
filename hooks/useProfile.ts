import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

async function fetchProfile(userId: string): Promise<{ displayName: string }> {
  const { data, error } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { displayName: data.display_name };
}

export function useProfile(userId: string | null) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => fetchProfile(userId as string),
    enabled: userId !== null,
  });
}

interface UpdateProfileInput {
  userId: string;
  displayName: string;
}

async function updateProfile(input: UpdateProfileInput): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ display_name: input.displayName })
    .eq('id', input.userId);

  if (error) {
    throw new Error(error.message);
  }
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profile', variables.userId] });
    },
  });
}
