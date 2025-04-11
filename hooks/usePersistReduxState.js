import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function usePersistReduxState(key, variable) {
  useEffect(() => {
    (async () => {
      await AsyncStorage.setItem(key, JSON.stringify(variable));
    })();
  }, [variable]); // Persist the variable whenever it changes
}