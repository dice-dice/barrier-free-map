import { useCallback, useState } from 'react';
import { supabase } from '../lib/supabase';

interface SignUpParams {
  email: string;
  password: string;
}

interface SignUpResult {
  requiresEmailConfirmation: boolean;
}

export function useSignUp() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const signUp = useCallback(async ({ email, password }: SignUpParams): Promise<SignUpResult | null> => {
    setLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return null;
    }

    return { requiresEmailConfirmation: data.session === null };
  }, []);

  return { signUp, loading, errorMessage, setErrorMessage };
}
