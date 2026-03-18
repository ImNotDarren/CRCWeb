# CRCWeb OTA Updates Guide (expo-updates + EAS)

## Overview

OTA (Over-The-Air) updates let you push JavaScript bundle updates to users without going through the App Store / Play Store review process. This uses `expo-updates` with EAS Update.

**What OTA CAN update:** JS/TS code, assets (images, fonts), styles, navigation changes.
**What OTA CANNOT update:** Native code changes (new native modules, `app.json` config changes affecting native, SDK upgrades). These require a new build.

---

## 1. Initial Setup (One-Time)

### Link your EAS project

```bash
# Login to Expo
npx eas login

# Initialize/link the project (this generates your project ID)
npx eas init
```

This will add your `projectId` to `app.json` under `expo.extra.eas.projectId`.

### Update the updates URL

After running `eas init`, open `app.json` and replace `YOUR_PROJECT_ID` in the updates URL with your actual project ID:

```json
"updates": {
  "url": "https://u.expo.dev/YOUR_ACTUAL_PROJECT_ID"
}
```

### Update eas.json submit config

Open `eas.json` and replace:
- `YOUR_APPLE_ID` with your Apple ID email
- `YOUR_APP_STORE_CONNECT_APP_ID` with your App Store Connect app ID

---

## 2. Understanding Channels & Runtime Versions

### Channels

Each build profile in `eas.json` has a `channel`:
- `development` — for dev client builds
- `preview` — for internal testing builds
- `production` — for App Store / Play Store builds

When you publish an update, you target a **channel**. Only builds on that channel will receive the update.

### Runtime Version

The `runtimeVersion` in `app.json` is set to `1.0.1`, matching the app version.

**Key rule:** An OTA update can only be applied to a build with a **matching runtime version**. If you change the app version and do a new build, old builds won't receive updates meant for the new version.

---

## 3. Building with EAS

You must create at least one build before you can send OTA updates. The build embeds the channel and runtime version.

```bash
# Production build for iOS
npx eas build --platform ios --profile production

# Production build for Android
npx eas build --platform android --profile production

# Preview build (internal testing)
npx eas build --platform ios --profile preview
```

---

## 4. Publishing OTA Updates

After making JS/TS changes, publish an update:

```bash
# Publish to production channel
npx eas update --channel production --message "Fix: corrected layout issue"

# Publish to preview channel (for testing first)
npx eas update --channel preview --message "Testing new activity page"

# Publish for a specific platform only
npx eas update --channel production --platform ios --message "iOS-specific fix"
```

### Recommended Workflow

1. Make your code changes
2. Test locally
3. Publish to `preview` channel first: `npx eas update --channel preview --message "description"`
4. Test on preview builds
5. Publish to `production`: `npx eas update --channel production --message "description"`

---

## 5. Checking for Updates in the App (Optional)

By default, `expo-updates` checks for updates on app launch. For more control, you can programmatically check:

```typescript
import * as Updates from 'expo-updates';

// Check and apply updates manually
async function checkForUpdates() {
  if (__DEV__) return; // Updates don't work in dev mode

  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync(); // Restart app with new update
    }
  } catch (e) {
    console.log('Error checking for updates:', e);
  }
}
```

You can call this on app launch, on a button press, or on a timer.

---

## 6. Managing Updates

### View published updates

```bash
# List all updates for a channel
npx eas update:list

# View update details
npx eas update:view <update-id>
```

### Rollback an update

If a bad update goes out, publish a new update with the fix, or roll back:

```bash
# Roll back to the previously embedded bundle
npx eas update:rollback --channel production
```

### Delete an update

```bash
npx eas update:delete --id <update-id>
```

---

## 7. When You Need a New Build (NOT OTA)

You need a **new native build** when:
- Adding/removing a native library (e.g., a new `react-native-*` package with native code)
- Changing anything in `app.json` that affects native config (permissions, bundle ID, plugins, etc.)
- Upgrading Expo SDK or React Native version
- Changing `expo.version` (this changes the runtime version, so new OTA updates won't reach old builds)

**Rule of thumb:** If `npx expo prebuild` produces different native files, you need a new build.

---

## 8. Quick Reference

| Action | Command |
|--------|---------|
| Login to EAS | `npx eas login` |
| Link project | `npx eas init` |
| Build (production) | `npx eas build --platform ios --profile production` |
| Build (preview) | `npx eas build --platform ios --profile preview` |
| Publish update | `npx eas update --channel production --message "msg"` |
| List updates | `npx eas update:list` |
| Rollback | `npx eas update:rollback --channel production` |
| Check update status | `npx eas update:view <id>` |

---

## Configuration Files Modified

- **`app.json`** — Added `runtimeVersion` and `updates` config
- **`app.config.js`** — Enabled updates with URL, channel headers, and runtime version
- **`eas.json`** — Created with `development`, `preview`, and `production` build profiles with corresponding channels
