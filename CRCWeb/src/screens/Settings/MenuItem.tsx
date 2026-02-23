import React from 'react';
import { Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import getStyles from './style';
import Expand from '@/src/components/Expand';
import { alert } from '@/utils/alert';
import { useSelector } from 'react-redux';
import type { RootState } from '@/src/types/store';
import { useColors } from '@/hooks/useColors';
import { AppMenuItem } from '@/src/components/ui';

interface SettingsMenuItemProps {
  title: string;
  icon: string;
  onNavigate?: () => void;
}

export function SettingsMenuItem({ title, icon, onNavigate }: SettingsMenuItemProps): React.ReactElement {
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const colors = useColors();
  const styles = getStyles(fontSize, colors);

  const handlePress = (): void => {
    if (onNavigate) return onNavigate();
    alert('Work in progress...');
  };

  return (
    <AppMenuItem
      title={
        <Text
          style={
            !onNavigate ? { ...styles.MenuItemTitle, color: colors.mutedText } : styles.MenuItemTitle
          }
        >
          {title}
        </Text>
      }
      accessoryLeft={
        <MaterialCommunityIcons
          name={icon as 'cog'}
          size={18 + fontSize}
          color={!onNavigate ? colors.mutedText : colors.text}
        />
      }
      accessoryRight={
        <>
          <Expand />
          <MaterialCommunityIcons
            name="chevron-right"
            size={22 + fontSize}
            color={!onNavigate ? colors.mutedText : colors.text}
          />
        </>
      }
      onPress={handlePress}
      style={styles.menuItem}
    />
  );
}
