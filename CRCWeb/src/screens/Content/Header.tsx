import getStyles from './style';
import { useSelector } from 'react-redux';
import type { RootState } from '@/src/types/store';
import { useColors } from '@/hooks/useColors';
import { TopBar } from '@/src/components/ui';

type ContentHeaderProps = {
  title: string;
  backAction?: React.ReactElement | null;
  forwardAction?: React.ReactElement | null;
};

export default function ContentHeader({ title, backAction, forwardAction }: ContentHeaderProps): React.ReactElement {
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const colors = useColors();
  const styles = getStyles(fontSize, colors);

  return (
    <TopBar
      title={title}
      accessoryLeft={backAction ?? undefined}
      accessoryRight={forwardAction ?? undefined}
      titleStyle={styles.title}
    />
  );
}
