import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useBiometrics } from '../hooks/useBiometrics';

export function LogoutButton() {
  const router = useRouter();
  const { logout } = useBiometrics();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <Pressable style={styles.button} onPress={handleLogout}>
      <Text style={styles.text}>Logout</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginRight: 10,
  },
  text: {
    color: '#CC222BFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
