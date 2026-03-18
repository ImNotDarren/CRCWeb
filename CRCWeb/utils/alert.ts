import { Alert, Platform } from 'react-native';

interface AlertButton {
  style?: string;
  onPress?: (value?: string) => void;
}

const promptPolyfill = (
  title: string,
  message: string,
  buttons: AlertButton[] = [],
  defaultText = ''
): void => {
  const result = window.prompt([title, message].filter(Boolean).join('\n'), defaultText);
  if (result !== null) {
    const submitButton = buttons.find(({ style }) => style !== 'cancel');
    submitButton?.onPress?.(result);
  } else {
    const cancelButton = buttons.find(({ style }) => style === 'cancel');
    cancelButton?.onPress?.();
  }
};

const promptFn = Platform.OS === 'web' ? promptPolyfill : Alert.prompt;

const alertPolyfill = (
  title: string,
  description?: string,
  options?: AlertButton[],
  _extra?: unknown
): void => {
  const result = window.confirm([title, description].filter(Boolean).join('\n'));
  if (result) {
    const confirmOption = options?.find(({ style }) => style !== 'cancel' && style !== 'destructive');
    confirmOption?.onPress?.();
  } else {
    const cancelOption = options?.find(({ style }) => style === 'cancel');
    cancelOption?.onPress?.();
  }
};

const alertFn: (title: string, message?: string) => void =
  Platform.OS === 'web' ? alertPolyfill : (title, message) => Alert.alert(title, message);
export const alert = alertFn;
export const prompt = promptFn;
