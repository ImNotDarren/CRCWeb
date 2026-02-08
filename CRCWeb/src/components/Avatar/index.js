import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

function generateInitialsAvatar(name) {
  const [firstName, lastName] = name.split(' ');
  const initials = (firstName ? firstName[0] : '') + (lastName ? lastName[0] : '');
  return initials.toUpperCase();
}

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 75%, 60%)`;
  return color;
}

export const InitialsAvatar = ({ name, size = 40 }) => {
  const initials = generateInitialsAvatar(name);
  const backgroundColor = stringToColor(name);
  const fontSize = size / 3; // Dynamically calculate font size, e.g., half of the avatar size.
  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor,
  };
  const textStyle = {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize, // Apply dynamic font size
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
  text: {
    // Base text styles; dynamic styles are applied inline
  },
});

export default InitialsAvatar;
