import React from 'react';
import { StyleSheet, Dimensions, Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';

const VimeoVideo = ({ vimeoId }) => {
  const videoUrl = `https://player.vimeo.com/video/${vimeoId}`;

  console.log(Platform.OS)

  return (
    <>
      {Platform.OS === "web" ? (
        <View style={[styles.video, { justifyContent: "center" }]}>
          <iframe src={videoUrl} height="100%" allow="fullscreen; picture-in-picture" />
        </View>
      ) :
        (<WebView
          style={styles.video}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          source={{ uri: videoUrl }}
          allowsFullscreenVideo={true}
        />)}
    </>
  );
};

const styles = StyleSheet.create({
  video: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width / 3 * 2, // You can adjust the height as needed
    // backgroundColor: 'transparent',
  },
});

export default VimeoVideo;
