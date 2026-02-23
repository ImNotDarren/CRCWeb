import React, { ReactNode } from 'react';
import { Text, StyleSheet, Linking, Image, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { alert } from '@/utils/alert';
import { useColors } from '@/hooks/useColors';

interface RichTextProps {
  text: string;
  color?: string;
  fontSize?: number;
  lineHeight?: number;
}

const RichText = ({
  text,
  color,
  fontSize = 14,
  lineHeight = 27,
}: RichTextProps): React.ReactElement => {
  const colors = useColors();
  const textColor = color ?? colors.text;
  const APP_TAGS = [
    { tag: '[facebook]', name: 'Facebook', icon: 'facebook', color: colors.primary, appScheme: 'fb://' },
    { tag: '[whatsapp]', name: 'WhatsApp', icon: 'whatsapp', color: colors.success, appScheme: 'whatsapp://send' },
    { tag: '[sms]', name: 'Messages', icon: 'message', color: colors.success, appScheme: 'sms:' },
  ];
  let imageCounter = 0;
  let linkCounter = 0;
  let textCounter = 0;
  const counter: Record<string, number> = {};
  APP_TAGS.forEach((app) => {
    counter[app.tag] = 0;
  });

  const handleRedirect = (app: (typeof APP_TAGS)[0]) => () => {
    void Linking.canOpenURL(app.appScheme).then((supported) => {
      if (supported) Linking.openURL(app.appScheme);
      else alert('Error', 'This app is not installed on your device');
    });
  };

  const tagRegex = /<([a-z]+)>([\s\S]*?)<\/\1>/g;
  const linkImageRegex =
    /\[(https:\/\/[^\s\]]+|fb:[^\s\]]+|whatsapp:[^\s\]]+|sms:[^\s\]]+|mailto:[^\s\]]+)\]|\[(.*?)\]\((https:\/\/[^\s\)]+|fb:[^\s\)]+|whatsapp:[^\s\)]+|sms:[^\s\)]+|mailto:[^\s\)]+)\)/g;
  const iconRegex = new RegExp(
    APP_TAGS.map((a) => a.tag.replace(/[[\]]/g, '\\$&')).join('|'),
    'g'
  );
  const combinedRegex = new RegExp(`${tagRegex.source}|${linkImageRegex.source}|${iconRegex.source}`, 'g');

  const styles = StyleSheet.create({
    text: { color: textColor },
    link: { color: colors.link, textDecorationLine: 'underline' as const },
    bold: { fontWeight: 'bold' as const },
    red: { color: colors.error },
    blue: { color: colors.primary },
    iconContainer: { height: 60, lineHeight: 60, justifyContent: 'center' as const, alignItems: 'center' as const },
    imageContainer: { flex: 1, justifyContent: 'center' as const, alignItems: 'center' as const, margin: 10 },
    image: { width: 250, height: 250 },
    icon: { marginHorizontal: 5 },
  });

  const parseText = (inputText: string, parentStyle: object = {}): ReactNode[] => {
    const output: ReactNode[] = [];
    let lastIndex = 0;
    inputText.replace(combinedRegex, (match, p1, p2, p3, p4, p5, offset) => {
      if (lastIndex < offset) {
        output.push(
          <Text key={`text-${offset}-${textCounter++}`} style={parentStyle}>
            {inputText.substring(lastIndex, offset)}
          </Text>
        );
      }
      if (p3) {
        output.push(
          <Image
            key={`img-${offset}-${imageCounter++}`}
            source={{ uri: p3 }}
            style={styles.image}
            resizeMode="contain"
          />
        );
      } else if (p4 && p5) {
        output.push(
          <Text
            key={`link-${offset}-${linkCounter++}`}
            style={[styles.link, parentStyle]}
            onPress={() => Linking.openURL(p5)}
          >
            {p4}
          </Text>
        );
      } else if (APP_TAGS.some((app) => app.tag === match)) {
        const currApp = APP_TAGS.find((app) => app.tag === match)!;
        output.push(
          <Text key={`${currApp.icon}-icon-${counter[currApp.tag]++}`} style={styles.iconContainer}>
            <TouchableOpacity activeOpacity={0.5} onPress={handleRedirect(currApp)} style={styles.icon}>
              <MaterialCommunityIcons name={currApp.icon as 'facebook'} size={50} color={currApp.color} />
            </TouchableOpacity>
          </Text>
        );
      } else {
        let currentStyle: object = {};
        if (p1 === 'b') currentStyle = styles.bold;
        else if (p1 === 'red') currentStyle = styles.red;
        else if (p1 === 'blue') currentStyle = styles.blue;
        output.push(...parseText(p2, { ...parentStyle, ...currentStyle }));
      }
      lastIndex = offset + match.length;
      return match;
    });
    if (lastIndex < inputText.length) {
      output.push(
        <Text key={`end-${lastIndex}-${textCounter++}`} style={parentStyle}>
          {inputText.substring(lastIndex)}
        </Text>
      );
    }
    return output;
  };

  const output = parseText(text);
  const groupedOutput: ReactNode[][] = [];
  let group: ReactNode[] = output.length ? [output[0]] : [];
  for (let i = 1; i < output.length; i++) {
    const curr = output[i] as React.ReactElement;
    const prev = output[i - 1] as React.ReactElement;
    if (curr?.type && prev?.type && (curr.type as { displayName?: string })?.displayName === (prev.type as { displayName?: string })?.displayName) {
      group.push(curr);
    } else {
      groupedOutput.push(group);
      group = [curr];
    }
  }
  if (group.length) groupedOutput.push(group);

  return (
    <View>
      {groupedOutput.map((grp, index) =>
        (grp[0] as React.ReactElement & { type?: { displayName?: string } })?.type?.displayName === 'Text' ? (
          <Text key={`group-${index}`} style={[styles.text, { color: textColor, fontSize, lineHeight }]}>
            {grp}
          </Text>
        ) : (
          <View key={`group-${index}`} style={styles.imageContainer}>
            {grp}
          </View>
        )
      )}
    </View>
  );
};

export default RichText;
