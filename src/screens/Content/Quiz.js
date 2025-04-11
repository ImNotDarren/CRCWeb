import { useEffect, useState } from "react";
import { View, Text, BackHandler, ScrollView, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import getStyles from "./style";
import { Button, Radio, RadioGroup, Spinner } from "@ui-kitten/components";
import Expand from "../../components/Expand";
import colors from "../../../theme/colors";
import RichText from "../../components/RichText";
import Popup from "../../components/Popup";
import { alert } from "../../../utils/alert";
import Config from "react-native-config";

export default function QuizScreen({ route, navigation }) {

  const { mid } = route.params;

  
  const user = useSelector((state) => state.user.user);
  const fontSize = useSelector((state) => state.font.fontSize);
  const modules = useSelector((state) => state.module.modules);
  const styles = getStyles(fontSize);

  const dispatch = useDispatch();

  const [module, setModule] = useState(JSON.parse(JSON.stringify(modules.find((m) => m.id === mid))));
  const [currQuestion, setCurrQuestion] = useState(0);
  const [selected, setSelected] = useState(null);

  const [refreshing, setRefreshing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [visible, setVisible] = useState(false);

  const getData = () => {
    setRefreshing(true);
    fetch(`${Config.SERVER_URL}/crc/multiplechoices/findByModuleId/${mid}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        const moduleCopy = JSON.parse(JSON.stringify(module));
        moduleCopy['crcMultipleChoices'] = data;
        setModule(moduleCopy);
        const modulesCopy = JSON.parse(JSON.stringify(modules));
        modulesCopy.find((m) => m.id === mid).crcMultipleChoices = data;
        dispatch({ type: 'UPDATE_CONTENTS', value: modulesCopy });
        setRefreshing(false);
      })
      .catch(error => {
        console.error(error);
        setRefreshing(false);
      });
  }

  useEffect(() => {
    if (module) {
      if (!module.crcMultipleChoices) {
        getData();
      }
    }
  }, [mid, dispatch]);

  // Prevent back button on Android from exiting the app
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // You can alert the user or simply do nothing
      // Return true to indicate that you have handled the back press
      return true;
    });

    // Cleanup on component unmount
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (user?.featureUsers[3]?.role === 'admin') {
      navigation.setOptions({
        headerBackVisible: true,
        gestureEnabled: true,
      });
    }
  }, []);

  const handleNext = async () => {
    if (confirmed) {
      if (currQuestion < module.crcMultipleChoices.length - 1) {
        setCurrQuestion(curr => curr + 1);
        setSelected(null);
        setConfirmed(false);
        return;
      }
      // All questions answered
      try {
        const response = await fetch(`${Config.SERVER_URL}/crc/multiplechoices/recordScore`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: user.id,
            mid: mid,
            score: score / module.crcMultipleChoices.length,
          }),
        });

        const data = await response.json();

        const moduleCopy = JSON.parse(JSON.stringify(module));
        moduleCopy.crcQuizUsers = [...module.crcQuizUsers, data];
        setModule(moduleCopy);
        const modulesCopy = JSON.parse(JSON.stringify(modules));
        modulesCopy.find((m) => m.id === mid).crcQuizUsers = [...module.crcQuizUsers, data];
        if (score / module.crcMultipleChoices.length >= 0.8) {
          const progressResponse = await fetch(`${Config.SERVER_URL}/crc/modules/setProgress`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              mid: mid,
              uid: user.id,
              progress: 1
            })
          });

          const progress = await progressResponse.json();

          modulesCopy.find((m) => m.id === mid).crcModuleProgresses = [progress, ...modulesCopy.find((m) => m.id === mid).crcModuleProgresses]
        }
        dispatch({ type: 'UPDATE_MODULES', value: modulesCopy });

        setVisible(true);

      } catch (err) {
        alert('Error', 'Failed to record score');
        console.error(err);
      }


      return;
    }
    setConfirmed(true);
    // if not confirmed, check if the answer is correct
    if (selected === module.crcMultipleChoices[currQuestion].answer) {
      // if correct
      setScore(score + 1);
    }
  }

  // console.log(module)

  if (!module?.crcMultipleChoices)
    return (
      <View style={styles.spinnerView}>
        <Spinner size="giant" status="info" />
      </View>
    );

  return (
    <ScrollView style={{ padding: 20 }}>
      <Popup
        visible={visible}
        setVisible={setVisible}
        animationTime={100}
        closeIcon={false}
      >
        <Text style={styles.quizPopupTitle}>
          {
            score / module.crcMultipleChoices.length > 0.8 ? `Congradulations! You passed this quiz!\nYour final score is ${((score / module.crcMultipleChoices.length) * 100).toFixed(1)}%!` : `Your final score is ${((score / module.crcMultipleChoices.length) * 100).toFixed(1)}%, you need to score at least 80% to pass the quiz.`
          }
        </Text>
        <Button onPress={() => navigation.navigate('Home')}>Confirm</Button>
      </Popup>
      <Text style={styles.quizQuestion}>
        ({currQuestion + 1}/{module.crcMultipleChoices.length}) {module.crcMultipleChoices[currQuestion]?.question}
      </Text>
      <View
        style={{ marginTop: 25 }}
      >
        {module.crcMultipleChoices[currQuestion]?.A ?
          <Radio
            checked={selected === 'A'}
            onChange={() => confirmed ? null : setSelected('A')}
            style={styles.radio}
          >
            {() => <Text
              style={[styles.multipleChoice, { color: module.crcMultipleChoices[currQuestion].answer === 'A' && confirmed ? colors.green[400] : module.crcMultipleChoices[currQuestion].answer !== 'A' && selected === 'A' && confirmed ? colors.red[300] : 'black' }]}
            >
              {module.crcMultipleChoices[currQuestion].A}
            </Text>}
          </Radio> : null
        }
        {module.crcMultipleChoices[currQuestion]?.B ?
          <Radio
            checked={selected === 'B'}
            onChange={() => confirmed ? null : setSelected('B')}
            style={styles.radio}
          >
            {() => <Text
              style={[styles.multipleChoice, { color: module.crcMultipleChoices[currQuestion].answer === 'B' && confirmed ? colors.green[400] : module.crcMultipleChoices[currQuestion].answer !== 'B' && selected === 'B' && confirmed ? colors.red[300] : 'black' }]}
            >
              {module.crcMultipleChoices[currQuestion].B}
            </Text>}
          </Radio> : null
        }
        {module.crcMultipleChoices[currQuestion]?.C ?
          <Radio
            checked={selected === 'C'}
            onChange={() => confirmed ? null : setSelected('C')}
            style={styles.radio}
          >
            {() => <Text
              style={[styles.multipleChoice, { color: module.crcMultipleChoices[currQuestion].answer === 'C' && confirmed ? colors.green[400] : module.crcMultipleChoices[currQuestion].answer !== 'C' && selected === 'C' && confirmed ? colors.red[300] : 'black' }]}
            >
              {module.crcMultipleChoices[currQuestion].C}
            </Text>}
          </Radio> : null
        }
        {module.crcMultipleChoices[currQuestion]?.D ?
          <Radio
            checked={selected === 'D'}
            onChange={() => confirmed ? null : setSelected('D')}
            style={styles.radio}
          >
            {() => <Text
              style={[styles.multipleChoice, { color: module.crcMultipleChoices[currQuestion].answer === 'D' && confirmed ? colors.green[400] : module.crcMultipleChoices[currQuestion].answer !== 'D' && selected === 'D' && confirmed ? colors.red[300] : 'black' }]}
            >
              {module.crcMultipleChoices[currQuestion].D}
            </Text>}
          </Radio> : null
        }
      </View>

      {confirmed && <View>
        <RichText text={module.crcMultipleChoices[currQuestion].explanation} fontSize={18 + fontSize} color={colors.red[300]} />
      </View>}

      {selected &&
        <View style={[styles.buttonView, { marginTop: 20 }]}>
          <Expand />
          <Button
            appearance='outline'
            style={{ width: 100, flexWrap: 'nowrap' }}
            onPress={handleNext}
          >
            {confirmed ? 'Next' : 'Submit'}
          </Button>
        </View>}
    </ScrollView>
  );
};