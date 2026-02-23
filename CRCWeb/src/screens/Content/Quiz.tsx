import { useEffect, useState } from "react";
import { View, Text, BackHandler, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/src/types/store";
import getStyles from "./style";
import { AppButton, AppRadio, AppSpinner } from "@/src/components/ui";
import Expand from "@/src/components/Expand";
import RichText from "@/src/components/RichText";
import Popup from "@/src/components/Popup";
import { alert } from "@/utils/alert";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { useColors } from "@/hooks/useColors";

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || '';

export default function QuizScreen(): React.ReactElement {
  const { mid } = useLocalSearchParams<{ mid: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const colors = useColors();
  const user = useSelector((state: RootState) => state.user.user);
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const modules = useSelector((state: RootState) => state.module.modules);
  const styles = getStyles(fontSize, colors);

  const dispatch = useDispatch();

  const foundModule = modules.find((m) => String(m.id) === String(mid));
  const [module, setModule] = useState<Record<string, unknown>>(JSON.parse(JSON.stringify(foundModule ?? {})));
  const [currQuestion, setCurrQuestion] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const [refreshing, setRefreshing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [visible, setVisible] = useState(false);

  const getData = () => {
    setRefreshing(true);
    fetch(`${SERVER_URL}/crc/multiplechoices/findByModuleId/${mid}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        const moduleCopy = JSON.parse(JSON.stringify(module));
        moduleCopy['crcMultipleChoices'] = data;
        setModule(moduleCopy);
        const modulesCopy = JSON.parse(JSON.stringify(modules));
        const m = modulesCopy.find((x: { id: number }) => String(x.id) === String(mid));
        if (m) m.crcMultipleChoices = data;
        dispatch({ type: 'UPDATE_MODULES', value: modulesCopy });
        setRefreshing(false);
      })
      .catch(error => {
        console.error(error);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    if (module?.id) {
      if (!module.crcMultipleChoices) {
        getData();
      }
    }
  }, [mid, dispatch]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (user?.featureUsers?.[3]?.role === 'admin') {
      navigation.setOptions({
        headerBackVisible: true,
        gestureEnabled: true,
      });
    }
  }, []);

  const handleNext = async () => {
    const choices = module.crcMultipleChoices as Array<{ answer: string; A?: string; B?: string; C?: string | null; D?: string | null; explanation?: string | null }>;
    if (!choices?.length) return;

    if (confirmed) {
      if (currQuestion < choices.length - 1) {
        setCurrQuestion(curr => curr + 1);
        setSelected(null);
        setConfirmed(false);
        return;
      }
      try {
        const response = await fetch(`${SERVER_URL}/crc/multiplechoices/recordScore`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: user?.id,
            mid: mid,
            score: score / choices.length,
          }),
        });

        const data = await response.json();

        const moduleCopy = JSON.parse(JSON.stringify(module));
        const quizUsers = (moduleCopy.crcQuizUsers || []) as unknown[];
        moduleCopy.crcQuizUsers = [...quizUsers, data];
        setModule(moduleCopy);
        const modulesCopy = JSON.parse(JSON.stringify(modules));
        const m = modulesCopy.find((x: { id: number }) => String(x.id) === String(mid));
        if (m) {
          m.crcQuizUsers = [...(m.crcQuizUsers || []), data];
          if (score / choices.length >= 0.8) {
            const progressResponse = await fetch(`${SERVER_URL}/crc/modules/setProgress`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                mid: mid,
                uid: user?.id,
                progress: 1
              })
            });
            const progress = await progressResponse.json();
            m.crcModuleProgresses = [progress, ...(m.crcModuleProgresses || [])];
          }
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
    if (selected === choices[currQuestion].answer) {
      setScore(score + 1);
    }
  };

  const choices = module.crcMultipleChoices as Array<{ question: string; answer: string; A?: string; B?: string; C?: string | null; D?: string | null; explanation?: string | null }> | undefined;

  if (!choices)
    return (
      <View style={styles.spinnerView}>
        <AppSpinner size="large" />
      </View>
    );

  const curr = choices[currQuestion];

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
            score / choices.length > 0.8
              ? `Congradulations! You passed this quiz!\nYour final score is ${((score / choices.length) * 100).toFixed(1)}%!`
              : `Your final score is ${((score / choices.length) * 100).toFixed(1)}%, you need to score at least 80% to pass the quiz.`
          }
        </Text>
        <AppButton onPress={() => router.push('/(tabs)')}>Confirm</AppButton>
      </Popup>
      <Text style={styles.quizQuestion}>
        ({currQuestion + 1}/{choices.length}) {curr?.question}
      </Text>
      <View style={{ marginTop: 25 }}>
        {curr?.A ?
          <AppRadio
            checked={selected === 'A'}
            onChange={() => confirmed ? null : setSelected('A')}
            style={styles.radio}
          >
            <Text
              style={[styles.multipleChoice, { color: curr.answer === 'A' && confirmed ? colors.success : curr.answer !== 'A' && selected === 'A' && confirmed ? colors.error : colors.text }]}
            >
              {curr.A}
            </Text>
          </AppRadio> : null
        }
        {curr?.B ?
          <AppRadio
            checked={selected === 'B'}
            onChange={() => confirmed ? null : setSelected('B')}
            style={styles.radio}
          >
            <Text
              style={[styles.multipleChoice, { color: curr.answer === 'B' && confirmed ? colors.success : curr.answer !== 'B' && selected === 'B' && confirmed ? colors.error : colors.text }]}
            >
              {curr.B}
            </Text>
          </AppRadio> : null
        }
        {curr?.C ?
          <AppRadio
            checked={selected === 'C'}
            onChange={() => confirmed ? null : setSelected('C')}
            style={styles.radio}
          >
            <Text
              style={[styles.multipleChoice, { color: curr.answer === 'C' && confirmed ? colors.success : curr.answer !== 'C' && selected === 'C' && confirmed ? colors.error : colors.text }]}
            >
              {curr.C}
            </Text>
          </AppRadio> : null
        }
        {curr?.D ?
          <AppRadio
            checked={selected === 'D'}
            onChange={() => confirmed ? null : setSelected('D')}
            style={styles.radio}
          >
            <Text
              style={[styles.multipleChoice, { color: curr.answer === 'D' && confirmed ? colors.success : curr.answer !== 'D' && selected === 'D' && confirmed ? colors.error : colors.text }]}
            >
              {curr.D}
            </Text>
          </AppRadio> : null
        }
      </View>

      {confirmed && curr && <View>
        <RichText text={curr.explanation || ''} fontSize={18 + fontSize} color={colors.error} />
      </View>}

      {selected &&
        <View style={[styles.buttonView, { marginTop: 20 }]}>
          <Expand />
          <AppButton
            appearance='outline'
            style={{ width: 100, flexWrap: 'nowrap' }}
            onPress={handleNext}
          >
            {confirmed ? 'Next' : 'Submit'}
          </AppButton>
        </View>}
    </ScrollView>
  );
}
