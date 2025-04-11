import React from 'react';
import { Text, StyleSheet, Linking, Image, TouchableOpacity, Alert, View } from 'react-native';
import colors from '../../../theme/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { alert } from '../../../utils/alert';

const RichText = ({ text, color = colors.grey[500], fontSize = 14, lineHeight = 27 }) => {
  let imageCounter = 0;
  let linkCounter = 0;
  let textCounter = 0;
  let counter = {}; // Counter for icons

  const apps = [
    {
      tag: "[facebook]",
      name: "Facebook",
      icon: "facebook",
      color: colors.blue[400],
      appScheme: "fb://"
    },
    {
      tag: "[whatsapp]",
      name: "WhatsApp",
      icon: "whatsapp",
      color: colors.green[500],
      appScheme: "whatsapp://send"
    },
    {
      tag: "[sms]",
      name: "Messages",
      icon: "message",
      color: colors.green[400],
      appScheme: "sms:"
    }
  ];

  for (let app of apps) {
    counter[app.tag] = 0;
  }

  const handleRedirect = (app) => () => {
    Linking.canOpenURL(app.appScheme).then(supported => {
      if (supported) {
        Linking.openURL(app.appScheme);
      } else {
        alert('Error', 'This app is not installed on your device');
      }
    });
  };

  function generateTagRegex(apps) {
    const tags = apps.map(app => app.tag.replace(/[[\]]/g, '\\$&')); // Escape [ and ]
    return new RegExp(tags.join('|'), 'g');
  }

  const parseText = (inputText, parentStyle = {}) => {
    const output = [];
    const tagRegex = /<([a-z]+)>([\s\S]*?)<\/\1>/g;  // Use [\s\S]*? for multiline matching
    const linkImageRegex = /\[(https:\/\/[^\s\]]+|fb:[^\s\]]+|whatsapp:[^\s\]]+|sms:[^\s\]]+|mailto:[^\s\]]+)\]|\[(.*?)\]\((https:\/\/[^\s\)]+|fb:[^\s\)]+|whatsapp:[^\s\)]+|sms:[^\s\)]+|mailto:[^\s\)]+)\)/g;
    const iconRegex = generateTagRegex(apps);
    let combinedRegex = new RegExp(`${tagRegex.source}|${linkImageRegex.source}|${iconRegex.source}`, 'g');
    let lastIndex = 0;

    inputText.replace(combinedRegex, (match, p1, p2, p3, p4, p5, offset) => {
      // Text before match
      if (lastIndex < offset) {
        output.push(
          <Text key={`text-${offset}-${textCounter++}`} style={parentStyle}>
            {inputText.substring(lastIndex, offset)}
          </Text>
        );
      }

      // Image
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
        // Link
        output.push(
          <Text
            key={`link-${offset}-${linkCounter++}`}
            style={[styles.link, parentStyle]}
            onPress={() => Linking.openURL(p5)}
          >
            {p4}
          </Text>
        );
      } else if (apps.map(app => app.tag).includes(match)) {
        const currApp = apps.find(app => app.tag === match);
        output.push(
          <Text key={`${currApp.icon}-icon-${counter[currApp.tag]++}`} style={styles.iconContainer}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={handleRedirect(currApp)}
              style={styles.icon}
            >
              <MaterialCommunityIcons name={currApp.icon} size={50} color={currApp.color} />
            </TouchableOpacity>
          </Text>
        );
      } else {
        // For nested tags, merge parent style with current tag style
        let currentStyle = {};
        switch (p1) {
          case 'b':
            currentStyle = styles.bold;
            break;
          case 'red':
            currentStyle = styles.red;
            break;
          case 'blue':
            currentStyle = styles.blue;
            break;
          default:
            break;
        }
        const combinedStyle = { ...parentStyle, ...currentStyle };

        output.push(...parseText(p2, combinedStyle));
      }

      lastIndex = offset + match.length;
    });

    // Remaining text after the last match
    if (lastIndex < inputText.length) {
      output.push(
        <Text key={`end-${lastIndex}-${textCounter++}`} style={parentStyle}>
          {inputText.substring(lastIndex)}
        </Text>
      );
    }

    return output;
  };

  const groupOutput = (output) => {
    if (output.length === 0) return [];

    const res = [];
    let group = [output[0]];

    for (let i = 1; i < output.length; i++) {
      if (output[i].type.displayName === output[i - 1].type.displayName) {
        group.push(output[i]);
      } else {
        res.push(group);
        group = [output[i]];
      }
    }

    res.push(group);

    return res;
  }

  const output = parseText(text);
  const groupedOutput = groupOutput(output);

  return (
    // <Text style={[styles.text, { color, fontSize, lineHeight }]}>
    //   {parseText(text)}
    // </Text>
    <View>
      {groupedOutput.map((group, index) => (
        group[0].type.displayName === "Text" ? (
          <Text key={`group-${index}`} style={[styles.text, { color, fontSize, lineHeight }]}>
            {group}
          </Text>
        ) : (
          <View key={`group-${index}`} style={styles.imageContainer}>
            {group}
          </View>
        )
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'grey',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  bold: {
    fontWeight: 'bold',
  },
  red: {
    color: 'red',
  },
  blue: {
    color: colors.blue[300],
  },
  iconContainer: {
    height: 60,
    lineHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  image: {
    width: 250,
    height: 250,
  },
  icon: {
    marginHorizontal: 5,
  },
});

export default RichText;
