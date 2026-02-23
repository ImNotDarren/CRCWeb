const path = require('path');
const fs = require('fs');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
const projectRoot = __dirname;

// Resolve @/ alias to project root; resolve directories to index file
function resolveAlias(context, moduleName, platform) {
  if (!moduleName.startsWith('@/')) {
    return context.resolveRequest(context, moduleName, platform);
  }
  const subpath = moduleName.slice(2); // strip '@/'
  const absoluteDir = path.join(projectRoot, subpath);
  const sourceExts = ['.tsx', '.ts', '.jsx', '.js', '.json'];
  // If it's a file with extension, use it
  for (const ext of sourceExts) {
    const filePath = absoluteDir + ext;
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return { type: 'sourceFile', filePath };
    }
  }
  // Otherwise try directory/index
  if (fs.existsSync(absoluteDir) && fs.statSync(absoluteDir).isDirectory()) {
    for (const ext of sourceExts) {
      const filePath = path.join(absoluteDir, 'index' + ext);
      if (fs.existsSync(filePath)) {
        return { type: 'sourceFile', filePath };
      }
    }
  }
  return context.resolveRequest(context, moduleName, platform);
}

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('@/')) {
    return resolveAlias(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;