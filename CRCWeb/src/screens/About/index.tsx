import { Image, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { ThemedText } from '@/src/components/ThemedText';
import { useColors } from '@/hooks/useColors';

const APP_NAME = 'CRCWeb';
const appVersion =
  Constants.expoConfig?.version ?? Constants.manifest?.version ?? '1.0.0';

const shadowCard = {
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 4,
};

const shadowPopup = {
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.12,
  shadowRadius: 24,
  elevation: 8,
};

const ABOUT_TEXT =
  'CRCWeb is an evidence-based online program designed for individuals with colorectal cancer. It helps patients cope with cancer and its symptoms while supporting mental health during treatment. The app can be used anytime and anywhere over the 3-month study period. The program includes educational content, behavioral activities, timely recommendations, and self-report surveys.';

export default function AboutScreen(): React.ReactElement {
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const bgColor = colors.background;
  const cardColor = colors.cardBackground;
  const badgeBg = colors.inputBackground;

  return (
    <View style={[styles.mainContainer, { backgroundColor: bgColor }]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: 20,
            paddingBottom: insets.bottom + 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={styles.headerWrapper}
        >
          <View style={styles.headerBlock}>
            <View style={[styles.iconContainer, { backgroundColor: cardColor }]}>
              <Image
                source={require('@/assets/icon.png')}
                style={styles.appIcon}
                resizeMode="contain"
              />
            </View>
            <ThemedText type="title" style={styles.heroAppName}>
              {APP_NAME}
            </ThemedText>
            <View
              style={[
                styles.versionBadge,
                {
                  backgroundColor: badgeBg,
                  borderColor: colors.border,
                },
              ]}
            >
              <ThemedText type="secondary" style={styles.versionText}>
                v{appVersion}
              </ThemedText>
            </View>
          </View>
        </Animated.View>

        {/* About Card */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={[styles.card, { backgroundColor: cardColor }, shadowCard]}
        >
          <ThemedText type="title" style={styles.cardTitle}>
            About
          </ThemedText>
          <ThemedText type="secondary" style={styles.descriptionText}>
            {ABOUT_TEXT}
          </ThemedText>
        </Animated.View>

        {/* Copyright */}
        <Animated.View
          entering={FadeInDown.delay(250).springify()}
          style={[styles.card, { backgroundColor: cardColor }, shadowCard]}
        >
          <ThemedText type="title" style={styles.cardTitle}>
            Copyright
          </ThemedText>
          <ThemedText type="secondary" style={styles.descriptionText}>
            All rights reserved. This app is part of the CRCWeb program.
          </ThemedText>
        </Animated.View>

        {/* Footer */}
        <Animated.View entering={FadeInUp.delay(500).springify()}>
          <View style={styles.footer}>
            <ThemedText type="secondary" style={styles.copyright}>
              © 2025 Emory University. All rights reserved.
            </ThemedText>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerWrapper: {
    width: '100%',
    marginBottom: 0,
    shadowColor: '#000',
    ...shadowPopup,
  },
  headerBlock: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 32,
    borderRadius: 24,
  },
  iconContainer: {
    marginBottom: 30,
    shadowColor: '#000',
    ...shadowCard,
    borderRadius: 30,
    overflow: 'hidden',
  },
  appIcon: {
    width: 120,
    height: 120,
    borderRadius: 20,
  },
  heroAppName: {
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  versionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  versionText: {
    fontSize: 14,
  },
  card: {
    width: '100%',
    borderRadius: 30,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    marginTop: 12,
    opacity: 0.9,
  },
  copyright: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
});
