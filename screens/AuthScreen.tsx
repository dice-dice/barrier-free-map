import { useState } from 'react';
import { LoginScreen } from './LoginScreen';
import { SignupScreen } from './SignupScreen';

type AuthMode = 'login' | 'signup';

export function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('login');

  if (mode === 'signup') {
    return <SignupScreen onNavigateToLogin={() => setMode('login')} />;
  }

  return <LoginScreen onNavigateToSignup={() => setMode('signup')} />;
}
