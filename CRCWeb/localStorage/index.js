import AsyncStorage from '@react-native-async-storage/async-storage';

const save = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
  }
};

const get = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key)
    // value previously stored
    return value;
  } catch (e) {
    // error reading value
    return e;
  }
};

const remove = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // removing error
  }
};

export { save, get, remove };