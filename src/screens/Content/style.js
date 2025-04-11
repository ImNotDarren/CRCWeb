import { Dimensions, StyleSheet } from "react-native";
import colors from "../../../theme/colors";

const getStyles = (fontSize) => {
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
      textAlign: 'left'
    },
    popupSubtitle: {
      fontSize: 15 + fontSize,
      textAlign: 'left',
      marginTop: 10,
      color: colors.grey[300],
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
      paddingVertical: 20,
      backgroundColor: 'transparent',
      height: '100%',
    },
    moduleContainer: {
      backgroundColor: 'transparent',
      height: '100%',
    },
    divider: {
      backgroundColor: colors.grey[200],
      marginVertical: 10,
    },
    title: {
      fontSize: 18 + fontSize,
      fontWeight: 'bold',
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
      // marginTop: 10,
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
      color: colors.grey[300],
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
      width: 'calc(100% - 40)',
      textAlign: 'center',
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
      color: colors.grey[300],
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
    },
    resourcesTitle: {
      fontSize: 18 + fontSize,
      fontWeight: 'bold',
      margin: 20,
    },
    quizQuestion: {
      fontSize: 25 + fontSize,
      fontWeight: 'bold',
    },
    radio: {
      marginBottom: 25,
    },
    multipleChoice: {
      fontSize: 20 + fontSize,
      marginLeft: 15,
      lineHeight: 30 + fontSize * 2,
    },
    quizPopupTitle: {
      fontSize: 20 + fontSize,
      textAlign: 'left',
      padding: 10,
      fontWeight: 'bold',
      lineHeight: 30 + fontSize * 2,
      marginBottom: 30,
    },
    question: {
      fontSize: 20 + fontSize,
      fontWeight: '500',
      marginVertical: 20,
      color: colors.grey[500],
    },
    evaluateView: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 40,
    },
    evaluateButton: {
      backgroundColor: colors.white,
      padding: 20,
      borderRadius: 40,
    },
  });
};

export default getStyles;