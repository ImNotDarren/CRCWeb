# CRCData

### Versions

node: `v18.18.2`

npm: `10.2.0`

### How to run

```
npx expo start
```

To start from iOS device:

```
npx expo run:ios --device
```

To start from Android device:

```
npx expo run:android --device
```

### Build Android

```
cd android
```

```
./gradlew assembleRelease
```

APK file in `android/app/build/outputs/apk/release/app-release.apk`

#### Create Android bundle (AAB)

```
npx react-native build-android --mode=release
```

AAB file in `android/app/build/outputs/bundle/release/app-release.aab`

### Build Web

[[Web Reference]](https://docs.expo.dev/distribution/publishing-websites/#creating-a-build)

Make sure netlify-cli is installed:

```
npm install -g netlify-cli
```

Then export web to `/dist` folder:

```
npx expo export -p web
```

You can serve locally to test it by running:

```
npx serve dist --single
```

Then, push to netlify and follow the commands in your terminal:

```
netlify deploy --dir dist
```

```
netlify deploy --prod
```