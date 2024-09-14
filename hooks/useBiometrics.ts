import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authenticateWithBiometrics, BiometricError } from '@/services/auth';
import { handleBiometricError } from '@/utils/errorHandler';

const AUTH_STATE_KEY = 'auth_state';

export function useBiometrics() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function loadAuthState() {
      try {
        const storedState = await AsyncStorage.getItem(AUTH_STATE_KEY);
        if (storedState) {
          setIsAuthenticated(JSON.parse(storedState));
        }
      } catch (e) {
        console.error('Failed to load auth state', e);
      }
    }
    loadAuthState();
  }, []);

  const authenticate = useCallback(async () => {
    try {
      const success = await authenticateWithBiometrics();
      setIsAuthenticated(success);
      await AsyncStorage.setItem(AUTH_STATE_KEY, JSON.stringify(success));
      return success;
    } catch (error) {
      handleBiometricError(error as BiometricError);

      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    setIsAuthenticated(false);
    await AsyncStorage.removeItem(AUTH_STATE_KEY);
  }, []);

  return { isAuthenticated, authenticate, logout };
}
