import { Stack } from 'expo-router';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LogoutButton } from '@/components/LogoutButton';
import { StatusBar } from 'react-native';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <StatusBar barStyle="dark-content" />
      <Stack>
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
      </Stack>
    </ErrorBoundary>
  );
}

export function MainLayout() {
  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <StatusBar barStyle="dark-content" />
        <Stack
          screenOptions={{
            headerRight: () => <LogoutButton />,
            headerStyle: {
              backgroundColor: '#f8f8f8',
            },
            headerTintColor: '#000',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Transactions' }} />
          <Stack.Screen
            name="[id]"
            options={{ title: 'Transaction Details' }}
          />
        </Stack>
      </ProtectedRoute>
    </ErrorBoundary>
  );
}
