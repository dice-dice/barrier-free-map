import * as Sentry from '@sentry/react-native';

const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

try {
  Sentry.init({
    dsn,
    enabled: dsn != null && dsn !== '',
  });
} catch (initError) {
  console.warn('Sentry.init failed', initError);
}

export { Sentry };
