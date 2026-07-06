import { useCallback, useState } from 'react';
import { supabase } from '../lib/supabase';

interface SignInParams {
  email: string;
  password: string;
}

export function useSignIn() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const signIn = useCallback(async ({ email, password }: SignInParams) => {
    setLoading(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return false;
    }

    return true;
  }, []);

  return { signIn, loading, errorMessage, setErrorMessage };
}
