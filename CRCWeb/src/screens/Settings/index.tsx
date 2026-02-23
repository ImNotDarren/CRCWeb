import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import getStyles from './style';
import { Button, ButtonGroup, Menu } from '@ui-kitten/components';
import fontSizes from '@/theme/fontSizes';
import { save } from '@/localStorage';
import { CustomizeMenuItem } from '@/src/components/CustomizeMenuItem';
import type { RootState } from '@/src/types/store';
import type { FontSizeKey } from '@/src/types/crc';

export default function SettingsScreen(): React.ReactElement {
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const styles = getStyles(fontSize);
  const dispatch = useDispatch();

  const handleFont = (fs: FontSizeKey) => (): void => {
    dispatch({ type: 'UPDATE_FONTSIZE', value: fs });
    void save('fontSize', fs);
  };

  return (
    <View>
      <Menu style={styles.menu}>
        <CustomizeMenuItem
          title="Font size"
          icon="format-size"
          accessoryRight={
            <View>
              <ButtonGroup appearance="outline">
                <Button disabled={fontSize === fontSizes.small} onPress={handleFont('small')}>
                  S
                </Button>
                <Button disabled={fontSize === fontSizes.medium} onPress={handleFont('medium')}>
                  M
                </Button>
                <Button disabled={fontSize === fontSizes.large} onPress={handleFont('large')}>
                  L
                </Button>
              </ButtonGroup>
            </View>
          }
        />
      </Menu>
    </View>
  );
}
