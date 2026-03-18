import React from 'react';
import { Modal, Pressable, View, type ViewStyle } from 'react-native';
import { useColors } from '@/hooks/useColors';
import type { ReactNode } from 'react';

interface AppModalProps {
  visible: boolean;
  onBackdropPress?: () => void;
  children: ReactNode;
  backdropStyle?: ViewStyle;
}

export function AppModal({
  visible,
  onBackdropPress,
  children,
  backdropStyle,
}: AppModalProps): React.ReactElement {
  const colors = useColors();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onBackdropPress}
    >
      <Pressable
        style={[
          {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          },
          backdropStyle,
        ]}
        onPress={onBackdropPress}
      >
        <Pressable onPress={(e) => e.stopPropagation()} style={{ flex: 0 }}>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
