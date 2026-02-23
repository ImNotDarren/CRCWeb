import React, { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import type { ReactNode } from 'react';

interface AppSelectProps {
  value?: string;
  onSelect: (index: number) => void;
  children: ReactNode;
  placeholder?: string;
  style?: object;
}

export function AppSelect({
  value,
  onSelect,
  children,
  placeholder = 'Select...',
  style,
}: AppSelectProps): React.ReactElement {
  const colors = useColors();
  const [open, setOpen] = useState(false);
  const options = React.Children.toArray(children);
  const handleSelect = (index: number) => {
    onSelect(index);
    setOpen(false);
  };
  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={[
          {
            minHeight: 50,
            backgroundColor: colors.inputBackground,
            borderRadius: 12,
            paddingHorizontal: 20,
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: colors.border,
          },
          style,
        ]}
      >
        <Text style={{ fontSize: 16, color: value ? colors.text : colors.inputPlaceholder }}>
          {value ?? placeholder}
        </Text>
      </Pressable>
      <Modal visible={open} transparent animationType="slide">
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }} onPress={() => setOpen(false)}>
          <Pressable onPress={(e) => e.stopPropagation()} style={{ backgroundColor: colors.cardBackground, borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingBottom: 34 }}>
            {options.map((child, index) => (
              <Pressable
                key={index}
                onPress={() => handleSelect(index)}
                style={{ paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: colors.divider }}
              >
                {React.isValidElement(child) && (child as React.ReactElement<{ title?: string }>).props?.title != null
                  ? <Text style={{ fontSize: 18, color: colors.text }}>{(child as React.ReactElement<{ title: string }>).props.title}</Text>
                  : child}
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

export function AppSelectItem({ title }: { title: string }): React.ReactElement {
  return <Text>{title}</Text>;
}
