import React from 'react';
import Pdf from 'react-native-pdf';
import { StyleSheet, View, Text } from 'react-native';

const PDFRenderer = ({ url }) => {
  // Validate the url to ensure it's a valid HTTPS URL
  const isValidHttpsUrl = (string) => {
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
    return url.protocol === "https:";
  };

  // Early return with error message if url is not a valid HTTPS URL
  if (!isValidHttpsUrl(url)) {
    return (
      <View style={styles.container}>
        <Text>Provided source is not a valid HTTPS URL.</Text>
      </View>
    );
  }

  // If url is valid, prepare the source object for the Pdf component
  const source = { uri: url, cache: true };

  return (
    <View style={styles.container}>
      <Pdf
        source={source}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onError={(error) => {
          console.error(error);
        }}
        style={styles.pdf}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default PDFRenderer;
