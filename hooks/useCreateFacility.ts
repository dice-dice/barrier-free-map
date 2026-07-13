import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { SpotCategory } from '../lib/database.types';
import { supabase } from '../lib/supabase';

interface CreateFacilityInput {
  name: string;
  description: string;
  category: SpotCategory;
  accessibilityFeatures: string[];
  address: string;
  latitude: number;
  longitude: number;
  createdBy: string;
}

async function createFacility(input: CreateFacilityInput): Promise<void> {
  const { error } = await supabase.from('spots').insert({
    name: input.name,
    description: input.description || null,
    category: input.category,
    accessibility_features: input.accessibilityFeatures,
    address: input.address || null,
    location: `SRID=4326;POINT(${input.longitude} ${input.latitude})`,
    created_by: input.createdBy,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export function useCreateFacility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFacility,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      queryClient.invalidateQueries({ queryKey: ['nearbySpots'] });
    },
  });
}
