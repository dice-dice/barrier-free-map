import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface PendingConfirmation {
  spotId: string;
  isAccurate: boolean;
  comment: string;
}

interface ConfirmSpotInput extends PendingConfirmation {
  userId: string;
}

async function confirmSpot(input: ConfirmSpotInput): Promise<void> {
  const { error } = await supabase.from('spot_confirmations').upsert(
    {
      spot_id: input.spotId,
      user_id: input.userId,
      is_accurate: input.isAccurate,
      comment: input.comment || null,
    },
    { onConflict: 'spot_id,user_id' }
  );

  if (error) {
    throw new Error(error.message);
  }
}

export function useConfirmSpot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmSpot,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      queryClient.invalidateQueries({ queryKey: ['nearbySpots'] });
      queryClient.invalidateQueries({ queryKey: ['myConfirmations', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['publicComments'] });
    },
  });
}
