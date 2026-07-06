import { useCallback, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useSignOut() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const signOut = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.signOut();

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return false;
    }

    return true;
  }, []);

  return { signOut, loading, errorMessage };
}
