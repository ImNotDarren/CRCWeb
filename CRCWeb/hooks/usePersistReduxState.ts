import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function usePersistReduxState(key: string, variable: unknown): void {
  useEffect(() => {
    void (async () => {
      await AsyncStorage.setItem(key, JSON.stringify(variable));
    })();
  }, [key, variable]);
}
