import { Text, TextInput, TouchableOpacity, View, Linking } from "react-native";
import styles from "./style";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get, save } from "../../../localStorage";
import { Radio } from "@ui-kitten/components";
import { alert } from "../../../utils/alert";

import { SERVER_URL } from "../../../constants";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);
  const versions = useSelector((state) => state.version.versions);

  const dispatch = useDispatch();

  const handleUpdateUser = (user) => {
    dispatch({ type: 'UPDATE_USER', value: user });
  }

  useEffect(() => {
    const getAutoLoginStatus = async () => {
      const autoLoginStatus = await get('autoLogin');
      if (autoLoginStatus) {
        const loginInfo = JSON.parse(autoLoginStatus);
        handleLogin(loginInfo.username, loginInfo.password)();
      }
    }

    getAutoLoginStatus();
  }, []); // Removed setAutoLogin from dependency array as it's a stable setter

  const handleAutoLoginChange = () => {
    setAutoLogin(curr => !curr);
  };

  const handleOpenPrivacyPolicy = () => {
    // Replace with your actual Privacy Policy URL
    const url = 'https://imnotdarren.github.io/CRCWeb/privacy-policy.html'; 
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  const handleLogin = (un, pwd) => () => {
    fetch(`${SERVER_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: un, password: pwd }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.message) {
          handleUpdateUser(data);
          save('autoLogin', JSON.stringify({
            username: un,
            password: pwd,
          }));
          navigation.replace('Versions');
        } else {
          alert('Login Failed', data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <View style={styles.outterBox}>
      <Text style={styles.title}>CRCWeb Login</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.checkboxView}>
        <Radio
          status='info'
          checked={autoLogin}
          onChange={handleAutoLoginChange}
        >
          Auto login
        </Radio>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin(username, password)}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.privacyLinkContainer} 
        onPress={handleOpenPrivacyPolicy}
      >
        <Text style={styles.privacyLinkText}>Privacy Policy</Text>
      </TouchableOpacity>
    </View>
  );
}