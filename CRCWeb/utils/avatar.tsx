import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

function generateInitialsAvatar(name: string): string {
  const [firstName, lastName] = name.split(' ');
  const initials = (firstName ? firstName[0] : '') + (lastName ? lastName[0] : '');
  return initials.toUpperCase();
}

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 75%, 60%)`;
}

interface InitialsAvatarProps {
  name: string;
  size?: number;
}

export const InitialsAvatar = ({ name, size = 40 }: InitialsAvatarProps): React.ReactElement => {
  const initials = generateInitialsAvatar(name);
  const backgroundColor = stringToColor(name);
  const fontSize = size / 3;
  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor,
  };
  const textStyle = {
    color: '#FFFFFF',
    fontWeight: 'bold' as const,
    fontSize,
  };

  return (
    <View style={[styles.avatar, avatarStyle]}>
      <Text style={[styles.text, textStyle]}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {},
});

export default InitialsAvatar;
