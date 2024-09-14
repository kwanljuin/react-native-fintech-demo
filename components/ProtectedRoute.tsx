import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useBiometrics } from '@/hooks/useBiometrics';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, authenticate } = useBiometrics();

  useEffect(() => {
    async function checkAuth() {
      if (!isLoading && !isAuthenticated) {
        await authenticate();
      }
    }
    checkAuth();
  }, [isAuthenticated, isLoading, authenticate]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Authenticating...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <>{children}</>;
}
