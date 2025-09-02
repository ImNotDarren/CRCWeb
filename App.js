import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FlashMessage from "react-native-flash-message";
import LoginScreen from './src/screens/Login';
import HomeScreen from './src/screens/Home';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { Alert, Platform, View } from 'react-native';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ContentScreen from './src/screens/Content';
import ActivityScreen from './src/screens/Activity';
import MeScreen from './src/screens/Me';
import HowToNavigateScreen from './src/screens/HowToNavigate';
import FAQScreen from './src/screens/FAQ';
import AdminScreen from './src/screens/Admin';
import SettingsScreen from './src/screens/Settings';
import ContentHomeScreen from './src/screens/Content/ContentHome';
import SurveyScreen from './src/screens/Survey';
import ContentPageScreen from './src/screens/Content/ContentPage';
import QuizScreen from './src/screens/Content/Quiz';
import EditScreen from './src/screens/Content/EditScreen';
import { useEffect, useState } from 'react';
import { get } from './localStorage';
import UserLocationsScreen from './src/screens/Admin/UserLocations';
import DiscussionScreen from './src/screens/Discussion';
import FitbitScreen from './src/screens/Fitbit';
import UserInfoScreen from './src/screens/Admin/UserInfo';
import ActivityPageScreen from './src/screens/Content/ActivityPage';
import PairedAccountsScreen from './src/screens/PairedAccounts';
import PendingPairsScreen from './src/screens/PairedAccounts/PendingPairs';
import { alert } from './utils/alert';
import ContactScreen from './src/screens/Contact';
import AddUser from './src/screens/Admin/component/AddUser';
import Config from 'react-native-config';
import VersionSelection from './src/screens/Login/VersionSelection';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabScreen({ navigation }) {

  const user = store.getState().user;
  const currentVersion = store.getState().version.currentVersion;
  const currUser = user.user;

  const [fitbitPermission, setFitbitPermission] = useState(false);

  useEffect(() => {
    if (currentVersion?.name) {
      navigation.setOptions({
        title: currentVersion.name,
        headerTitleAlign: 'center',
      })
    }
  }, [currentVersion]);

  useEffect(() => {
    fetch(`${Config.SERVER_URL}/crc/permission/findByUserId/${currUser.id}`)
      .then(response => response.json())
      .then(data => {
        store.dispatch({ type: 'UPDATE_PERMISSIONS', value: data });
        setFitbitPermission(data.find(p => p.type === "fitbit"));
      })
      .catch(err => {
        alert('Error', err.message);
      });
  }, [currUser]);

  useEffect(() => {
    setFitbitPermission(user.permissions.find(p => p.type === "fitbit") ? true : false);
  }, [user]);

  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View>
              <MaterialCommunityIcons name="home" color={color} size={size} />
            </View>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Content"
        component={ContentScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View>
              <MaterialCommunityIcons name="school" color={color} size={size} />
            </View>
          ),
          headerShown: false,
        }}
      />
      {fitbitPermission && Platform.OS !== "web" &&
        <Tab.Screen
          name="Fitbit"
          component={FitbitScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <View>
                <MaterialCommunityIcons name="fire-circle" color={color} size={size} />
              </View>
            ),
            headerShown: false,
          }}
        />}
      <Tab.Screen
        name="Survey"
        component={SurveyScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View>
              <MaterialCommunityIcons name="form-select" color={color} size={size} />
            </View>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Me"
        component={MeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View>
              <MaterialCommunityIcons name="account" color={color} size={size} />
            </View>
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {

  useEffect(() => {
    const getFontSize = async () => {
      try {
        const fontSize = await get('fontSize');
        if (fontSize !== null && fontSize !== undefined) {
          store.dispatch({ type: 'UPDATE_FONTSIZE', value: fontSize });
        }
      } catch (err) {
        alert('Error', err.message);
      }
    }

    getFontSize();
  }, []);

  const currentVersion = store.getState().version.currentVersion;

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Versions"
              component={VersionSelection}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TabNavigation"
              component={TabScreen}
              label="Home"
              options={({ navigation }) => ({
                title: currentVersion.name,
                headerTitleAlign: 'center',
              })}
            />
            <Stack.Screen
              name="How To Navigate"
              component={HowToNavigateScreen}
            />
            <Stack.Screen
              name="FAQ"
              component={FAQScreen}
            />
            <Stack.Screen
              name="Manage Accounts"
              component={AdminScreen}
            />
            <Stack.Screen
              name="Add User"
              component={AddUser}
              options={({ navigation }) => ({
                headerBackTitleVisible: false,
              })}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
            />
            <Stack.Screen
              name="ContentHome"
              component={ContentHomeScreen}
              options={({ navigation }) => ({
                headerBackTitleVisible: false,
              })}
            />
            <Stack.Screen
              name="ContentPage"
              component={ContentPageScreen}
              options={({ navigation }) => ({
                headerBackTitleVisible: false,
              })}
            />
            <Stack.Screen
              name="ActivityPage"
              component={ActivityPageScreen}
              options={({ navigation }) => ({
                headerBackTitleVisible: false,
              })}
            />
            <Stack.Screen
              name="Quiz"
              component={QuizScreen}
              options={({ navigation }) => ({
                gestureEnabled: false,
                headerBackVisible: false,
                headerBackTitleVisible: false,
              })}
            />
            <Stack.Screen
              name="Edit"
              component={EditScreen}
              options={({ navigation }) => ({
                headerBackTitleVisible: false,
                presentation: 'modal',
              })}
            />
            <Stack.Screen
              name="UserInfo"
              component={UserInfoScreen}
              options={({ navigation }) => ({
                headerBackTitleVisible: false,
                title: "User Info",
              })}
            />
            <Stack.Screen
              name="UserLocations"
              component={UserLocationsScreen}
              options={({ navigation }) => ({
                headerBackTitleVisible: false,
                title: "Locations",
              })}
            />
            <Stack.Screen
              name="Activity"
              component={ActivityScreen}
              options={({ navigation }) => ({
                headerBackTitleVisible: false,
                title: "Physical Activity",
              })}
            />
            <Stack.Screen
              name="Discussion"
              component={DiscussionScreen}
              options={({ navigation }) => ({
                headerBackTitleVisible: false,
              })}
            />
            <Stack.Screen
              name="PairedAccounts"
              component={PairedAccountsScreen}
              options={({ navigation }) => ({
                headerBackTitleVisible: false,
                title: "Pairs"
              })}
            />
            <Stack.Screen
              name="PendingPairs"
              component={PendingPairsScreen}
              options={({ navigation }) => ({
                headerBackTitleVisible: false,
                title: "Pending Pairs"
              })}
            />
            <Stack.Screen
              name="Contact"
              component={ContactScreen}
              options={({ navigation }) => ({
                headerBackTitleVisible: false,
                title: "Contact Us"
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
      <FlashMessage position="top" />
    </ApplicationProvider>
  );
}