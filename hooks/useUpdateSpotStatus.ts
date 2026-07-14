import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { SpotStatus } from '../lib/database.types';
import { supabase } from '../lib/supabase';

interface UpdateSpotStatusInput {
  spotId: string;
  status: SpotStatus;
}

async function updateSpotStatus(input: UpdateSpotStatusInput): Promise<void> {
  const { error } = await supabase.from('spots').update({ status: input.status }).eq('id', input.spotId);

  if (error) {
    throw new Error(error.message);
  }
}

export function useUpdateSpotStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSpotStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingSpots'] });
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      queryClient.invalidateQueries({ queryKey: ['nearbySpots'] });
      queryClient.invalidateQueries({ queryKey: ['mySpots'] });
    },
  });
}
