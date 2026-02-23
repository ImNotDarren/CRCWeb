import React from 'react';
import { Text } from 'react-native';
import { MenuItem } from '@ui-kitten/components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Expand from '@/src/components/Expand';
import colors from '@/theme/colors';
import { useSelector } from 'react-redux';
import getStyles from './style';
import { alert } from '@/utils/alert';
import type { RootState } from '@/src/types/store';

interface UserMenuItemProps {
  title: string;
  icon: string;
  onNavigate?: () => void;
}

export function UserMenuItem({ title, icon, onNavigate }: UserMenuItemProps): React.ReactElement {
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const styles = getStyles(fontSize);

  const handlePress = (): void => {
    if (onNavigate) return onNavigate();
    alert('Work in progress...');
  };

  return (
    <MenuItem
      title={() => (
        <Text
          style={
            !onNavigate ? { ...styles.MenuItemTitle, color: colors.grey[300] } : styles.MenuItemTitle
          }
        >
          {title}
        </Text>
      )}
      accessoryLeft={() => (
        <MaterialCommunityIcons
          name={icon as 'cog'}
          size={18 + fontSize}
          color={!onNavigate ? colors.grey[300] : undefined}
        />
      )}
      accessoryRight={() => (
        <>
          <Expand />
          <MaterialCommunityIcons
            name="chevron-right"
            size={22 + fontSize}
            color={!onNavigate ? colors.grey[300] : undefined}
          />
        </>
      )}
      style={styles.menuItem}
      onPress={handlePress}
    />
  );
}
