import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import colors from '../../../theme/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ProgressBar = ({ title, curr, goal, size, icon }) => {
  const fill = (curr / goal) * 100;

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      transform: [{ translateY: 10}],
    },
    points: {
      backgroundColor: 'transparent',
      position: 'absolute',
      textAlign: 'center',
      color: colors.blue[400],
      fontSize: size === 'big' ? 35 : 20,
      // fontWeight: 100,
    },
    label: {
      fontSize: size === 'big' ? 22: 18,
      fontWeight: 100,
      color: colors.grey[400],
      // fontWeight: 500,
      marginTop: size === 'big' ? -10 : -5,
    },
  });

  return (
    <View style={styles.container}>
      <AnimatedCircularProgress
        size={size === 'big' ? 150 : 80}
        width={size === 'big' ? 12 : 6}
        fill={fill}
        tintColor={colors.blue[400]}
        backgroundColor={colors.blue[200]}
        rotation={235}
        lineCap='round'
        arcSweepAngle={250}
      >
        {
          (fill) => (
            icon ?
            <MaterialCommunityIcons name={icon} size={size === 'big' ? 50 : 30} color={colors.blue[400]} /> 
            :
            <Text style={styles.points}>
              {curr}
            </Text>
          )
        }
      </AnimatedCircularProgress>
      <Text style={styles.label}>{title}</Text>
    </View>
  );
};

export default ProgressBar;
