import { useState } from 'react';
import { LoginScreen } from './LoginScreen';
import { SignupScreen } from './SignupScreen';
import { TermsScreen } from './TermsScreen';

type AuthMode = 'login' | 'signup' | 'terms';

export function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [previousMode, setPreviousMode] = useState<'login' | 'signup'>('login');

  const showTerms = () => {
    setPreviousMode(mode === 'terms' ? previousMode : (mode as 'login' | 'signup'));
    setMode('terms');
  };

  if (mode === 'terms') {
    return <TermsScreen onDone={() => setMode(previousMode)} />;
  }

  if (mode === 'signup') {
    return <SignupScreen onNavigateToLogin={() => setMode('login')} onShowTerms={showTerms} />;
  }

  return <LoginScreen onNavigateToSignup={() => setMode('signup')} onShowTerms={showTerms} />;
}
