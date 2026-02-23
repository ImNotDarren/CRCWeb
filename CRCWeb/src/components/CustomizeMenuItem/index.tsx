import { Alert, Text, View } from 'react-native';
import { CircularProgressBar, MenuItem } from '@ui-kitten/components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Expand from '@/src/components/Expand';
import colors from '@/theme/colors';
import { useSelector } from 'react-redux';
import getStyles from './style';
import type { RootState } from '@/src/types/store';
import type { ReactNode } from 'react';

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
  const styles = getStyles(fontSize);

  const handlePress = (): void => {
    onNavigate?.();
  };

  return (
    <MenuItem
      title={() => (
        <View style={styles.titleView}>
          <Text
            style={
              !onNavigate && !accessoryRight
                ? { ...styles.MenuItemTitle, color: colors.grey[300] }
                : styles.MenuItemTitle
            }
          >
            {title}
          </Text>
          {subtitle && <Text style={styles.MenuItemSubtitle}>{subtitle}</Text>}
        </View>
      )}
      accessoryLeft={() =>
        icon ? (
          <MaterialCommunityIcons
            name={icon as 'circle'}
            size={18 + fontSize}
            color={!onNavigate && !accessoryRight ? colors.grey[300] : undefined}
            style={{ marginRight: 10 }}
          />
        ) : (
          <View />
        )
      }
      accessoryRight={() => (
        <>
          <Expand />
          {progress != null && (
            <CircularProgressBar
              progress={progress}
              size="small"
              style={styles.progressBar}
              status={progress === 1 ? 'success' : 'info'}
            />
          )}
          {progress == null && accessoryRight ? (
            accessoryRight
          ) : (
            <MaterialCommunityIcons
              name="chevron-right"
              size={22 + fontSize}
              color={!onNavigate ? colors.grey[300] : undefined}
            />
          )}
        </>
      )}
      style={styles.menuItem}
      onPress={handlePress}
      onLongPress={drag}
    />
  );
}
