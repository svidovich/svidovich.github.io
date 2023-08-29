// OS Utilities

const PLATFORMS = Object.freeze({
  MACOS: "macos",
  IOS: "ios",
  WINDOWS: "windows",
  ANDROID: "android",
  LINUX: "linux",
  UNKNOWN: "unknown",
});

const MOBILE_PLATFORMS = [PLATFORMS.IOS, PLATFORMS.ANDROID];
const DESKTOP_PLATFORMS = [PLATFORMS.LINUX, PLATFORMS.WINDOWS, PLATFORMS.MACOS];

// Stolen OS Detector. See:
// https://stackoverflow.com/questions/38241480/detect-macos-ios-windows-android-and-linux-os-with-js
export const getOS = () => {
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator?.userAgentData?.platform || window.navigator.platform;
  const macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"];
  const windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];
  const iosPlatforms = ["iPhone", "iPad", "iPod"];

  if (macosPlatforms.indexOf(platform) !== -1) {
    return PLATFORMS.MACOS;
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    return PLATFORMS.IOS;
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    return PLATFORMS.WINDOWS;
  } else if (/Android/.test(userAgent)) {
    return PLATFORMS.ANDROID;
  } else if (/Linux/.test(platform)) {
    return PLATFORMS.LINUX;
  }
  return PLATFORMS.UNKNOWN;
};

export const isDesktop = () => {
  return DESKTOP_PLATFORMS.includes(getOS());
};

export const isMobile = () => {
  return MOBILE_PLATFORMS.includes(getOS());
};
