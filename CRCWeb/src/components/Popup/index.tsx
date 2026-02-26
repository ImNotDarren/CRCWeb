import React, { useEffect, useRef } from 'react';
import { View, Animated, TouchableOpacity, Keyboard, Easing, ScrollView } from 'react-native';
import { AppModal } from '@/src/components/ui';
import getStyles from './style';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { ReactNode } from 'react';
import { useColors } from '@/hooks/useColors';

interface PopupProps {
  children?: ReactNode;
  visible: boolean;
  setVisible: (v: boolean) => void;
  onClose?: () => void;
  animationTime?: number;
  closeIcon?: boolean;
}

export default function Popup({
  children,
  visible,
  setVisible,
  onClose,
  closeIcon = true,
}: PopupProps): React.ReactElement {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const keyboardOffset = useRef(new Animated.Value(0)).current;
  const colors = useColors();
  const styles = getStyles(colors);

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener('keyboardWillShow', (e) => {
      const { height } = e.endCoordinates;
      Animated.timing(keyboardOffset, {
        toValue: -height / 2 + 40,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }).start();
    });
    const keyboardHideListener = Keyboard.addListener('keyboardWillHide', () => {
      Animated.timing(keyboardOffset, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }).start();
    });
    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, [keyboardOffset]);

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }).start();
    } else {
      Animated.spring(scaleAnim, { toValue: 0, friction: 5, useNativeDriver: true }).start();
    }
  }, [visible, scaleAnim]);

  const handleClose = (): void => {
    setVisible(false);
    onClose?.();
  };

  return (
    <View style={{ flex: 1 }}>
      <AppModal visible={visible} onBackdropPress={handleClose} backdropStyle={styles.backdrop}>
        <Animated.View style={[styles.centeredView, { transform: [{ translateY: keyboardOffset }] }]}>
          <Animated.View style={[styles.modalView, { transform: [{ scale: scaleAnim }] }]}>
            {closeIcon && (
              <TouchableOpacity onPress={handleClose} style={styles.iconButton}>
                <MaterialCommunityIcons name="close" size={22} color={colors.icon} />
              </TouchableOpacity>
            )}
            <ScrollView style={{ ...styles.childrenView, marginTop: closeIcon ? 30 : 0 } as object} contentContainerStyle={{ paddingBottom: 100 }}>
              {children}
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </AppModal>
    </View>
  );
}
