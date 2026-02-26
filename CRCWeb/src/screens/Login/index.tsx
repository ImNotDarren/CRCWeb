import { Text, TextInput, TouchableOpacity, View, Linking } from 'react-native';
import getStyles from './style';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get, save } from '@/localStorage';
import { AppRadio } from '@/src/components/ui';
import { alert } from '@/utils/alert';
import { useRouter } from 'expo-router';
import type { RootState } from '@/src/types/store';
import type { User } from '@/src/types/common';
import { useLogin } from '@/hooks/api';
import { useColors } from '@/hooks/useColors';
import { ThemedView } from '@/src/components/ThemedView';

export default function LoginScreen(): React.ReactElement {
  const router = useRouter();
  const colors = useColors();
  const styles = getStyles(colors);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);
  const dispatch = useDispatch();
  const { login } = useLogin();

  const handleUpdateUser = (user: User): void => {
    dispatch({ type: 'UPDATE_USER', value: user });
  };

  useEffect(() => {
    const getAutoLoginStatus = async (): Promise<void> => {
      const autoLoginStatus = await get('autoLogin');
      if (autoLoginStatus) {
        const loginInfo = JSON.parse(autoLoginStatus) as { username: string; password: string };
        handleLogin(loginInfo.username, loginInfo.password)();
      }
    };
    getAutoLoginStatus();
  }, []);

  const handleAutoLoginChange = (): void => {
    setAutoLogin((curr) => !curr);
  };

  const handleOpenPrivacyPolicy = (): void => {
    Linking.openURL('https://imnotdarren.github.io/CRCWeb/privacy-policy.html').catch((err) =>
      console.error("Couldn't load page", err)
    );
  };

  const handleLogin = (un: string, pwd: string) => (): void => {
    login({ username: un, password: pwd })
      .then((data) => {
        if (!('message' in data)) {
          handleUpdateUser(data);
          save('autoLogin', JSON.stringify({ username: un, password: pwd }));
          router.replace('/versions');
        } else {
          alert('Login Failed', data.message);
        }
      })
      .catch((err) => console.error('Error:', err));
  };

  return (
    <ThemedView style={styles.outterBox}>
      <Text style={styles.title}>CRCWeb Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor={colors.inputPlaceholder}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.inputPlaceholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.checkboxView}>
        <AppRadio checked={autoLogin} onChange={handleAutoLoginChange}>
          <Text style={styles.checkboxText}>Auto login</Text>
        </AppRadio>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin(username, password)}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.privacyLinkContainer} onPress={handleOpenPrivacyPolicy}>
        <Text style={styles.privacyLinkText}>Privacy Policy</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}
