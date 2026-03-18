import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { ReactNode } from 'react';

interface ExpandProps {
  children?: ReactNode;
}

const Expand = ({ children }: ExpandProps): React.ReactElement => (
  <View style={styles.expandedComponent}>{children}</View>
);

const styles = StyleSheet.create({
  expandedComponent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Expand;
