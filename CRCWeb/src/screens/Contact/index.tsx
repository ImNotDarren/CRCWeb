import React from 'react';
import { useSelector } from 'react-redux';
import getStyles from './style';
import { ScrollView, Text } from 'react-native';
import RichText from '@/src/components/RichText';
import WhiteSpace from '@/src/components/WhiteSpace';
import type { RootState } from '@/src/types/store';

export default function ContactScreen(): React.ReactElement {
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const styles = getStyles(fontSize);

  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.title, { marginTop: 0 }]}>About Us</Text>
      <RichText
        text="We are cancer researchers from the Nell Hodgson Woodruff School of Nursing, School of Medicine, and the Winship Cancer Institute of Emory University. The project is funded by the Heilbrunn Nurse Scholar Award. We aim to conduct a clinical trial to assess the feasibility and acceptability of a technology-based intervention to promote mental health for patients with colorectal cancer receiving chemotherapy."
        fontSize={18}
      />
      <Text style={styles.title}>Principal Investigator</Text>
      <RichText text="Yufen Lin, PhD, RN" fontSize={18} />
      <Text style={styles.title}>Co-Investigator</Text>
      <RichText
        text="Canhua Xiao, PhD, RN\nOlatunji B. Alese, MD\nRunze Yan, PhD\nMelinda K. Higgins, PhD\nLaura S. Porter, PhD"
        fontSize={18}
      />
      <Text style={styles.title}>Software Engineers</Text>
      <RichText text="Darren Liu\nDel Bold" fontSize={18} />
      <Text style={styles.title}>Contact Number</Text>
      <RichText text="(404) 251-4072" fontSize={18} />
      <Text style={styles.title}>Contact Email</Text>
      <RichText text="canbewell@emory.edu" fontSize={18} />
      <WhiteSpace />
    </ScrollView>
  );
}
