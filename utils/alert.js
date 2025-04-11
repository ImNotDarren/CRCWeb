import { Alert, Platform } from 'react-native';

const promptPolyfill = (title, message, buttons = [], defaultText = '') => {
  const result = window.prompt([title, message].filter(Boolean).join('\n'), defaultText);
  if (result !== null) {
    const submitButton = buttons.find(({ style }) => style !== 'cancel');
    submitButton && submitButton.onPress(result);
  } else {
    const cancelButton = buttons.find(({ style }) => style === 'cancel');
    cancelButton && cancelButton.onPress();
  }
};

const prompt = Platform.OS === 'web' ? promptPolyfill : Alert.prompt;

const alertPolyfill = (title, description, options, extra) => {
  const result = window.confirm([title, description].filter(Boolean).join('\n'))

  if (result) {
      const confirmOption = options.find(({ style }) => style !== 'cancel' && style !== 'destructive')
      confirmOption && confirmOption.onPress()
  } else {
      const cancelOption = options.find(({ style }) => style === 'cancel')
      cancelOption && cancelOption.onPress()
  }
}

const alert = Platform.OS === 'web' ? alertPolyfill : Alert.alert;

export { alert, prompt };
