import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, TouchableOpacity, Keyboard, Easing, ScrollView } from 'react-native';
import { Modal } from '@ui-kitten/components';
import styles from './style';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../theme/colors';

export default function Popup({ children, visible, setVisible, onClose, animationTime = 300, closeIcon = true }) {
  const scaleAnim = useRef(new Animated.Value(0)).current; // Initial scale
  // const [keyboardHeight, setKeyboardHeight] = useState(0);
  const keyboardOffset = useRef(new Animated.Value(0)).current; // Initial keyboard offset

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener('keyboardWillShow', (e) => {
      const { height } = e.endCoordinates;
      Animated.timing(keyboardOffset, {
        toValue: -height / 2 + 40,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease)
      }).start();
      // setKeyboardHeight(height);
    });

    const keyboardHideListener = Keyboard.addListener('keyboardWillHide', () => {
      Animated.timing(keyboardOffset, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease)
      }).start();
      // setKeyboardHeight(0);
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true
      }).start();
    } else {
      Animated.spring(scaleAnim, {
        toValue: 0,
        friction: 5,
        useNativeDriver: true
      }).start();
    }
  }, [visible]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) {
      onClose();
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Modal
        visible={visible}
        onBackdropPress={handleClose}
        backdropStyle={styles.backdrop}
      >
        <Animated.View style={[styles.centeredView, { transform: [{ translateY: keyboardOffset }] }]}>
          <Animated.View style={[styles.modalView, { transform: [{ scale: scaleAnim }] }]}>
            {closeIcon && <TouchableOpacity
              onPress={handleClose}
              style={styles.iconButton}
            >
              <MaterialCommunityIcons name="close" size={22} color={colors.grey[300]} />
            </TouchableOpacity>}
            <ScrollView style={{ ...styles.childrenView, marginTop: closeIcon ? 30 : 0 }}>
              {children}
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
};
