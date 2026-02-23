import { Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Expand from '@/src/components/Expand';
import { useSelector } from 'react-redux';
import getStyles from './style';
import type { RootState } from '@/src/types/store';
import type { ReactNode } from 'react';
import { useColors } from '@/hooks/useColors';
import { CircularProgressSmall } from '@/src/components/ui';

interface CustomizeMenuItemProps {
  title: string;
  subtitle?: string;
  icon?: string;
  progress?: number;
  onNavigate?: () => void;
  drag?: () => void;
  active?: boolean;
  accessoryRight?: ReactNode;
}

export function CustomizeMenuItem({
  title,
  subtitle,
  icon,
  progress,
  onNavigate,
  drag,
  accessoryRight,
}: CustomizeMenuItemProps): React.ReactElement {
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const colors = useColors();
  const styles = getStyles(fontSize, colors);

  const menuItemStyle = [
    styles.menuItem,
    { backgroundColor: colors.cardBackground, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  ];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={menuItemStyle}
      onPress={onNavigate}
      onLongPress={drag}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        {icon ? (
          <MaterialCommunityIcons
            name={icon as 'circle'}
            size={18 + fontSize}
            color={!onNavigate && !accessoryRight ? colors.mutedText : colors.text}
            style={{ marginRight: 10 }}
          />
        ) : (
          <View style={{ marginRight: 10 }} />
        )}
        <View style={styles.titleView}>
          <Text
            style={
              !onNavigate && !accessoryRight
                ? { ...styles.MenuItemTitle, color: colors.mutedText }
                : { ...styles.MenuItemTitle, color: colors.text }
            }
          >
            {title}
          </Text>
          {subtitle != null && subtitle !== '' && (
            <Text style={[styles.MenuItemSubtitle, { color: colors.secondaryText }]}>
              {subtitle}
            </Text>
          )}
        </View>
        <Expand />
        {progress != null ? (
          <CircularProgressSmall progress={progress} size={40} />
        ) : accessoryRight ? (
          accessoryRight
        ) : (
          <MaterialCommunityIcons
            name="chevron-right"
            size={22 + fontSize}
            color={!onNavigate ? colors.mutedText : colors.text}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}
