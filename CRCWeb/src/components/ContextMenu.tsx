import React from 'react';
import NativeContextMenu from 'react-native-context-menu-view';
import { ContextMenuProps } from '@/src/components/ContextMenu.web';

const ContextMenu = ({ dropdownMenuMode, actions, onPress, children, title }: ContextMenuProps) => {
  return (
    <NativeContextMenu
      dropdownMenuMode={dropdownMenuMode}
      title={title}
      actions={actions}
      onPress={(e) => onPress(e.nativeEvent.index)}
    >
      {children}
    </NativeContextMenu>
  );
};

export default ContextMenu;