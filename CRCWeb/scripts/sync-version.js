#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const version = process.argv[2];

if (!version) {
  console.error('Usage: npm run version:sync <version>');
  console.error('Example: npm run version:sync 1.2.0');
  process.exit(1);
}

if (!/^\d+\.\d+\.\d+$/.test(version)) {
  console.error('Error: Version must be in semver format (e.g., 1.2.0)');
  process.exit(1);
}

// --- package.json ---
const pkgPath = path.join(ROOT, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const oldPkgVersion = pkg.version;
pkg.version = version;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log(`  package.json          version: ${oldPkgVersion} → ${version}`);

// --- app.json ---
const appJsonPath = path.join(ROOT, 'app.json');
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
const oldAppVersion = appJson.expo.version;
const oldAppRuntime = appJson.expo.runtimeVersion;
appJson.expo.version = version;
appJson.expo.runtimeVersion = version;
fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');
console.log(`  app.json              version: ${oldAppVersion} → ${version}`);
console.log(`  app.json       runtimeVersion: ${oldAppRuntime} → ${version}`);

// --- app.config.js ---
const configPath = path.join(ROOT, 'app.config.js');
let config = fs.readFileSync(configPath, 'utf8');

// version
const oldConfigVersion = config.match(/version:\s*['"]([^'"]*)['"]/)?.[1];
config = config.replace(/version:\s*['"][^'"]*['"]/, `version: '${version}'`);
console.log(`  app.config.js         version: ${oldConfigVersion} → ${version}`);

// runtimeVersion
const oldRuntime = config.match(/runtimeVersion:\s*['"]([^'"]*)['"]/)?.[1];
config = config.replace(/runtimeVersion:\s*['"][^'"]*['"]/, `runtimeVersion: '${version}'`);
console.log(`  app.config.js  runtimeVersion: ${oldRuntime} → ${version}`);

// iOS buildNumber: reset to 1 on version change, increment on same version
const buildMatch = config.match(/buildNumber:\s*['"](\d+)['"]/);
if (buildMatch) {
  const oldBuild = buildMatch[1];
  const versionChanged = oldConfigVersion !== version;
  const newBuild = versionChanged ? '1' : String(parseInt(oldBuild, 10) + 1);
  config = config.replace(/buildNumber:\s*['"][^'"]*['"]/, `buildNumber: '${newBuild}'`);
  console.log(`  app.config.js     buildNumber: ${oldBuild} → ${newBuild}${versionChanged ? ' (reset)' : ''}`);
}

// Android versionCode (auto-increment)
const vcMatch = config.match(/versionCode:\s*(\d+)/);
if (vcMatch) {
  const oldVc = vcMatch[1];
  const newVc = parseInt(oldVc, 10) + 1;
  config = config.replace(/versionCode:\s*\d+/, `versionCode: ${newVc}`);
  console.log(`  app.config.js     versionCode: ${oldVc} → ${newVc}`);
}

fs.writeFileSync(configPath, config);

// Compute build values for native files (same logic as app.config.js)
const versionChanged = oldConfigVersion !== version;
const nativeBuildNumber = buildMatch
  ? (versionChanged ? '1' : String(parseInt(buildMatch[1], 10) + 1))
  : '1';
const nativeVersionCode = vcMatch
  ? parseInt(vcMatch[1], 10) + 1
  : 1;

// --- ios/CRCWeb/Info.plist ---
const plistPath = path.join(ROOT, 'ios', 'CRCWeb', 'Info.plist');
if (fs.existsSync(plistPath)) {
  let plist = fs.readFileSync(plistPath, 'utf8');

  // CFBundleShortVersionString
  const oldPlistVersion = plist.match(/<key>CFBundleShortVersionString<\/key>\s*<string>([^<]*)<\/string>/)?.[1];
  plist = plist.replace(
    /(<key>CFBundleShortVersionString<\/key>\s*<string>)[^<]*(<\/string>)/,
    `$1${version}$2`
  );
  console.log(`  Info.plist             version: ${oldPlistVersion} → ${version}`);

  // CFBundleVersion (build number)
  const oldPlistBuild = plist.match(/<key>CFBundleVersion<\/key>\s*<string>([^<]*)<\/string>/)?.[1];
  plist = plist.replace(
    /(<key>CFBundleVersion<\/key>\s*<string>)[^<]*(<\/string>)/,
    `$1${nativeBuildNumber}$2`
  );
  console.log(`  Info.plist         buildNumber: ${oldPlistBuild} → ${nativeBuildNumber}${versionChanged ? ' (reset)' : ''}`);

  fs.writeFileSync(plistPath, plist);
}

// --- android/app/build.gradle ---
const gradlePath = path.join(ROOT, 'android', 'app', 'build.gradle');
if (fs.existsSync(gradlePath)) {
  let gradle = fs.readFileSync(gradlePath, 'utf8');

  // versionName
  const oldGradleVersion = gradle.match(/versionName\s+"([^"]*)"/)?.[1];
  gradle = gradle.replace(/versionName\s+"[^"]*"/, `versionName "${version}"`);
  console.log(`  build.gradle       versionName: ${oldGradleVersion} → ${version}`);

  // versionCode
  const oldGradleVc = gradle.match(/versionCode\s+(\d+)/)?.[1];
  gradle = gradle.replace(/versionCode\s+\d+/, `versionCode ${nativeVersionCode}`);
  console.log(`  build.gradle       versionCode: ${oldGradleVc} → ${nativeVersionCode}`);

  fs.writeFileSync(gradlePath, gradle);
}

console.log(`\nAll config files synced to v${version}`);
