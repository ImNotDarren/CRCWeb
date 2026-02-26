import { Dimensions, StyleSheet } from 'react-native';
import type { ThemeColors } from '@/constants/Colors';

export default function getStyles(fontSize: number, colors: ThemeColors) {
  return StyleSheet.create({
    navigationButtonView: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      margin: 20,
      flex: 1,
      position: 'absolute',
      bottom: 10,
      left: 0,
      right: 0,
    },
    editContainer: {
      flex: 1,
      paddingVertical: 20,
    },
    outsideContainer: {
      flex: 1,
      flexDirection: 'column',
    },
    popupTitle: {
      fontSize: 20 + fontSize,
      textAlign: 'left',
      color: colors.text,
    },
    popupSubtitle: {
      fontSize: 15 + fontSize,
      textAlign: 'left',
      marginTop: 10,
      color: colors.mutedText,
    },
    homePopupButtonView: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 30,
    },
    spinnerView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      paddingVertical: 10,
      backgroundColor: 'transparent',
      height: '100%',
    },
    moduleContainer: {
      backgroundColor: 'transparent',
      height: '100%',
    },
    divider: {
      backgroundColor: colors.border,
      marginVertical: 10,
    },
    title: {
      fontSize: 18 + fontSize,
      fontWeight: 'bold',
      color: colors.text,
    },
    actionButton: {
      padding: 10,
    },
    buttonArea: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      margin: 20,
    },
    transcriptButton: {
      flex: 1,
      marginRight: 20,
    },
    slidesButton: {
      flex: 1,
    },
    lectureNote: {
      fontSize: 18 + fontSize,
      color: colors.mutedText,
      margin: 20,
      marginTop: 10,
    },
    buttonView: {
      margin: 20,
      marginTop: 10,
      display: 'flex',
      flexDirection: 'row',
    },
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    transcriptCard: {
      width: Dimensions.get('window').width * 0.8,
      height: Dimensions.get('window').height * 0.7,
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
    },
    transcriptTitleText: {
      fontSize: 22 + fontSize,
      fontWeight: 'bold',
      margin: 10,
      width: '100%' as const,
      textAlign: 'center',
      color: colors.text,
    },
    transcriptContent: {
      marginTop: 10,
    },
    slideView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    slideButton: {
      width: 200,
    },
    contentsView: {
      height: '100%',
      paddingVertical: 20,
    },
    disclosure: {
      color: colors.mutedText,
      padding: 25,
      fontSize: 16 + fontSize,
      lineHeight: 25 + fontSize * 2,
    },
    contentPageView: {
      flex: 1,
      padding: 20,
    },
    textInput: {
      fontSize: 20 + fontSize,
      lineHeight: 27 + fontSize * 2,
      borderRadius: 10,
      marginBottom: 100,
      color: colors.text,
      backgroundColor: colors.inputBackground,
      padding: 12,
    },
    resourcesTitle: {
      fontSize: 18 + fontSize,
      fontWeight: 'bold',
      margin: 20,
      color: colors.text,
    },
    quizQuestion: {
      fontSize: 25 + fontSize,
      fontWeight: 'bold',
      color: colors.text,
    },
    radio: {
      marginBottom: 25,
    },
    multipleChoice: {
      fontSize: 20 + fontSize,
      marginLeft: 15,
      lineHeight: 30 + fontSize * 2,
      color: colors.text,
    },
    quizPopupTitle: {
      fontSize: 20 + fontSize,
      textAlign: 'left',
      padding: 10,
      fontWeight: 'bold',
      lineHeight: 30 + fontSize * 2,
      marginBottom: 30,
      color: colors.text,
    },
    question: {
      fontSize: 20 + fontSize,
      fontWeight: '500',
      marginVertical: 20,
      color: colors.text,
    },
    evaluateView: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 40,
    },
    evaluateButton: {
      backgroundColor: colors.cardBackground,
      padding: 20,
      borderRadius: 40,
    },
  });
}
