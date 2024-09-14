import { Alert } from 'react-native';
import { BiometricErrorType, BiometricError } from '@/services/auth';

export function handleBiometricError(error: BiometricError) {
  switch (error.type) {
    case BiometricErrorType.NO_HARDWARE:
    case BiometricErrorType.NOT_ENROLLED:
    case BiometricErrorType.NOT_AVAILABLE:
      Alert.alert('Biometric Authentication Unavailable', error.message);
      break;
    case BiometricErrorType.LOCKOUT:
      Alert.alert(
        'Authentication Locked',
        'Too many failed attempts. Please try again later.',
      );
      break;
    case BiometricErrorType.DISABLED:
      Alert.alert(
        'Biometrics Disabled',
        'Please enable biometric authentication in your device settings.',
      );
      break;
    case BiometricErrorType.CANCELED:
    case BiometricErrorType.USER_FALLBACK:
      // These are user actions, not errors to display
      break;
    case BiometricErrorType.UNKNOWN:
    default:
      Alert.alert('Authentication Error', error.message);
      break;
  }
}

export function createBiometricError(
  type: BiometricErrorType,
  customMessage?: string,
): BiometricError {
  const defaultMessages = {
    [BiometricErrorType.NO_HARDWARE]:
      'This device does not have biometric hardware.',
    [BiometricErrorType.NOT_ENROLLED]:
      'No biometrics are enrolled on this device.',
    [BiometricErrorType.CANCELED]: 'Biometric authentication was canceled.',
    [BiometricErrorType.DISABLED]:
      'Biometric authentication is currently disabled.',
    [BiometricErrorType.LOCKOUT]:
      'Biometric authentication is locked out due to too many failed attempts.',
    [BiometricErrorType.USER_FALLBACK]:
      'User selected to use the fallback authentication method.',
    [BiometricErrorType.NOT_AVAILABLE]:
      'Biometric authentication is not available at this time.',
    [BiometricErrorType.UNKNOWN]:
      'An unknown error occurred during biometric authentication.',
  };

  return {
    type,
    message: customMessage || defaultMessages[type],
  };
}
