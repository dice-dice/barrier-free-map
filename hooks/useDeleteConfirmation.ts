import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

async function deleteConfirmation(confirmationId: string): Promise<void> {
  const { error } = await supabase.from('spot_confirmations').delete().eq('id', confirmationId);

  if (error) {
    throw new Error(error.message);
  }
}

export function useDeleteConfirmation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteConfirmation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      queryClient.invalidateQueries({ queryKey: ['nearbySpots'] });
      queryClient.invalidateQueries({ queryKey: ['publicComments'] });
    },
  });
}
