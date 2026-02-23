import React from 'react';
import { ScrollView } from 'react-native';
import getStyles from './style';
import { useSelector } from 'react-redux';
import { CustomizeMenuItem } from '@/src/components/CustomizeMenuItem';
import { openURL } from '@/utils/url';
import type { RootState } from '@/src/types/store';

export default function SurveyScreen(): React.ReactElement {
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const styles = getStyles(fontSize);
  const user = useSelector((state: RootState) => state.user.user);

  const surveys = [
    { title: 'Before Survey', url: 'https://redcap.emory.edu/surveys/?s=THERLANMEJ834XX4e' },
    { title: 'After Survey', url: 'https://redcap.emory.edu/surveys/?s=8FHH87R7LPY8Y3W3' },
    {
      title: 'Weekly Check-in',
      url: `https://redcap.emory.edu/surveys/?s=4AHNNAF3EELD7X8H&uid=${user?.id ?? ''}`,
    },
    { title: 'Consent Form', url: 'https://redcap.emory.edu/surveys/?s=W9JJNRN9JDKCHPFK' },
  ];

  return (
    <ScrollView style={styles.container}>
      {surveys.map((survey, index) => (
        <CustomizeMenuItem
          key={index}
          title={survey.title}
          onNavigate={survey.url ? () => void openURL(survey.url) : undefined}
        />
      ))}
    </ScrollView>
  );
}
