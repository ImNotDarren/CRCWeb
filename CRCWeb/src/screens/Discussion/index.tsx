import React from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import getStyles from './style';
import { useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { alert } from '@/utils/alert';
import type { RootState } from '@/src/types/store';
import { useColors } from '@/hooks/useColors';
import { ThemedScrollView } from '@/src/components/ThemedScrollView';

interface AppItem {
  name: string;
  icon: string;
  color: string;
  appScheme: string;
}

export default function DiscussionScreen(): React.ReactElement {
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const colors = useColors();
  const styles = getStyles(fontSize, colors);

  const apps: AppItem[] = [
    { name: 'Facebook', icon: 'facebook', color: colors.primary, appScheme: 'fb://' },
    { name: 'WhatsApp', icon: 'whatsapp', color: colors.success, appScheme: 'whatsapp://' },
    { name: 'Messages', icon: 'message', color: colors.success, appScheme: 'sms://' },
  ];

  const handleRedirect = (app: AppItem) => (): void => {
    void Linking.canOpenURL(app.appScheme).then((supported) => {
      if (supported) Linking.openURL(app.appScheme);
      else alert('Error', 'This app is not installed on your device');
    });
  };

  return (
    <ThemedScrollView style={styles.container}>
      <Text style={styles.title}>Please select an app for communication</Text>
      <View style={styles.buttonContainer}>
        {apps.map((app, index) => (
          <TouchableOpacity key={index} activeOpacity={0.5} onPress={handleRedirect(app)}>
            <MaterialCommunityIcons
              name={app.icon as 'facebook'}
              size={50}
              color={app.color}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ThemedScrollView>
  );
}
