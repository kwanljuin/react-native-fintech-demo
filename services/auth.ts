import { createBiometricError } from '@/utils/errorHandler';
import * as LocalAuthentication from 'expo-local-authentication';

export enum BiometricErrorType {
  NO_HARDWARE = 'NO_HARDWARE',
  NOT_ENROLLED = 'NOT_ENROLLED',
  CANCELED = 'CANCELED',
  DISABLED = 'DISABLED',
  LOCKOUT = 'LOCKOUT',
  USER_FALLBACK = 'USER_FALLBACK',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
  UNKNOWN = 'UNKNOWN',
}

export interface BiometricError {
  type: BiometricErrorType;
  message: string;
}

export async function authenticateWithBiometrics(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) {
    throw createBiometricError(BiometricErrorType.NO_HARDWARE);
  }

  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  if (!isEnrolled) {
    throw createBiometricError(BiometricErrorType.NOT_ENROLLED);
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Authenticate to access your transactions',
    fallbackLabel: 'Use passcode',
  });

  if (result.success) {
    return true;
  } else if (result.error === 'user_cancel') {
    throw createBiometricError(BiometricErrorType.CANCELED);
  } else if (result.error === 'system_cancel') {
    throw createBiometricError(BiometricErrorType.DISABLED);
  } else if (result.error === 'lockout') {
    throw createBiometricError(BiometricErrorType.LOCKOUT);
  } else if (result.error === 'user_fallback') {
    throw createBiometricError(BiometricErrorType.USER_FALLBACK);
  } else {
    throw createBiometricError(BiometricErrorType.UNKNOWN);
  }
}
