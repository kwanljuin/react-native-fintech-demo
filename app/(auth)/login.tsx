import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { useBiometrics } from '@/hooks/useBiometrics';
import { BiometricError } from '@/services/auth';
import { Ionicons } from '@expo/vector-icons';
import { handleBiometricError } from '@/utils/errorHandler';

export default function Login() {
  const { authenticate } = useBiometrics();

  const handleLogin = async () => {
    try {
      const success = await authenticate();
      if (success) {
        router.replace('/(main)');
      }
    } catch (error) {
      handleBiometricError(error as BiometricError);
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Please login to continue</Text>
        <Pressable style={styles.button} onPress={handleLogin}>
          <View style={styles.buttonContent}>
            <Ionicons
              name="lock-closed"
              size={24}
              color="white"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Secure Login with Biometrics</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
  },
  button: {
    width: '100%',
    backgroundColor: '#2F2F2FFF',
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 10,
  },
});
