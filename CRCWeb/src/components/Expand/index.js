import React from 'react';
import { View, StyleSheet } from 'react-native';

const Expand = ({children}) => {
  return (
    <View style={styles.expandedComponent}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  expandedComponent: {
    flex: 1, // This component takes up the remaining space, pushing the side components to the sides
    justifyContent: 'center', // Center the text horizontally in the center component
    alignItems: 'center', // Center the text vertically in the center component
  },
});

export default Expand;
