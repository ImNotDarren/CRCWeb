import React from 'react';
import { StyleSheet, Dimensions, Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface VimeoVideoProps {
  vimeoId: string;
}

const VimeoVideo = ({ vimeoId }: VimeoVideoProps): React.ReactElement => {
  const videoUrl = `https://player.vimeo.com/video/${vimeoId}`;
  return (
    <>
      {Platform.OS === 'web' ? (
        <View style={[styles.video, { justifyContent: 'center' }]}>
          <iframe src={videoUrl} height="100%" allow="fullscreen; picture-in-picture" />
        </View>
      ) : (
        <WebView
          style={styles.video}
          javaScriptEnabled
          domStorageEnabled
          source={{ uri: videoUrl }}
          allowsFullscreenVideo
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  video: {
    width: Dimensions.get('window').width,
    height: (Dimensions.get('window').width / 3) * 2,
  },
});

export default VimeoVideo;
