import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import getStyles from './style';
import fontSizes from '@/theme/fontSizes';
import { save } from '@/localStorage';
import { CustomizeMenuItem } from '@/src/components/CustomizeMenuItem';
import type { RootState } from '@/src/types/store';
import type { FontSizeKey } from '@/src/types/crc';
import { useColors } from '@/hooks/useColors';
import { ThemedView } from '@/src/components/ThemedView';
import { AppButton } from '@/src/components/ui';

export default function SettingsScreen(): React.ReactElement {
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const colors = useColors();
  const styles = getStyles(fontSize, colors);
  const dispatch = useDispatch();

  const handleFont = (fs: FontSizeKey) => (): void => {
    dispatch({ type: 'UPDATE_FONTSIZE', value: fs });
    void save('fontSize', fs);
  };

  return (
    <ThemedView>
      <View style={styles.menu}>
        <CustomizeMenuItem
          title="Font size"
          icon="format-size"
          accessoryRight={
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <AppButton disabled={fontSize === fontSizes.small} onPress={handleFont('small')} appearance="outline">
                S
              </AppButton>
              <AppButton disabled={fontSize === fontSizes.medium} onPress={handleFont('medium')} appearance="outline">
                M
              </AppButton>
              <AppButton disabled={fontSize === fontSizes.large} onPress={handleFont('large')} appearance="outline">
                L
              </AppButton>
            </View>
          }
        />
      </View>
    </ThemedView>
  );
}
