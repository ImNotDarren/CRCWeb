import { ReactNode } from 'react';
import * as RadixContextMenu from '@radix-ui/react-context-menu';
import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu';
import { useColors } from '@/hooks/useColors';

export interface ContextMenuAction {
  title: string;
  subtitle?: string;
  systemIcon?: string;
  destructive?: boolean;
  selected?: boolean;
}

export interface ContextMenuProps {
  dropdownMenuMode?: boolean;
  actions: ContextMenuAction[];
  onPress: (index: number) => void;
  children: ReactNode;
  title?: string;
}

const ContextMenu = ({ dropdownMenuMode, actions, onPress, children }: ContextMenuProps) => {
  const colors = useColors();
  const Menu = dropdownMenuMode ? RadixDropdownMenu : RadixContextMenu;

  const menuContent = (
    <Menu.Portal>
      <Menu.Content
        style={{
          backgroundColor: colors.cardBackground,
          borderRadius: 6,
          padding: 5,
          boxShadow: '0px 10px 38px -10px rgba(22, 23, 24, 0.35)',
          zIndex: 50,
        }}
      >
        {actions.map((action, index) => (
          <Menu.Item
            key={action.title}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
              outline: 'none',
              color: action.destructive ? colors.error : action.selected ? colors.primary : colors.text,
              fontWeight: action.selected ? '600' : 'normal',
              borderRadius: 4,
            }}
            onSelect={() => onPress(index)}
          >
            <span style={{ width: 16, flexShrink: 0 }}>
              {action.selected ? '✓' : ''}
            </span>
            <span>
              {action.title}
              {action.subtitle && (
                <div style={{ fontSize: '10px', color: colors.mutedText, fontWeight: 'normal' }}>{action.subtitle}</div>
              )}
            </span>
          </Menu.Item>
        ))}
      </Menu.Content>
    </Menu.Portal>
  );

  return (
    <Menu.Root>
      <Menu.Trigger asChild>{children}</Menu.Trigger>
      {menuContent}
    </Menu.Root>
  );
};

export default ContextMenu;