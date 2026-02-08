import { Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "./style";
import { useEffect, useState } from "react";
// import { LinearGradient } from "expo-linear-gradient";
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
  }, [setAutoLogin]);

  const handleAutoLoginChange = () => {
    setAutoLogin(curr => !curr);
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
          // update user in redux
          handleUpdateUser(data);
          // save auto login status
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
    // <LinearGradient colors={['#d6fcff', '#bbe2fc', '#96b6ff']} style={styles.linearGradient}>
    <View style={styles.outterBox}>
      <Text style={styles.title}>CRCWeb Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry // Hide password input
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
    </View>
  );
}