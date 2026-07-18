import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'hasSeenDisclaimerNotice';

export function useDisclaimerNotice() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value !== 'true') {
        setIsVisible(true);
      }
    });
  }, []);

  const dismiss = () => {
    setIsVisible(false);
    AsyncStorage.setItem(STORAGE_KEY, 'true');
  };

  return { isVisible, dismiss };
}
