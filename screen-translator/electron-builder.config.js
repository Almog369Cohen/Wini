/** @type {import('electron-builder').Configuration} */
module.exports = {
  appId: 'com.screentranslator.app',
  productName: 'Screen Translator',
  directories: {
    output: 'out',
    buildResources: 'build',
  },
  files: [
    'dist/**/*',
    'package.json',
  ],
  mac: {
    category: 'public.app-category.productivity',
    target: ['dmg'],
    icon: 'build/icon.icns',
    hardenedRuntime: true,
    entitlements: 'build/entitlements.mac.plist',
    entitlementsInherit: 'build/entitlements.mac.plist',
    extendInfo: {
      NSScreenCaptureUsageDescription:
        'Screen Translator needs screen recording access to capture and translate text from your screen.',
    },
  },
};
