import { Platform } from 'react-native';

const android = Platform.OS === 'android';

/** Words that differ between iPhone and Android, so copy names the right store and settings. */
export const platformWords = {
  /** "App Store" or "Google Play". */
  store: android ? 'Google Play' : 'App Store',
  /** The account purchases belong to: "Apple ID" or "Google account". */
  account: android ? 'Google account' : 'Apple ID',
  /** Where notification permissions live: "your iPhone Settings" or "your phone's Settings". */
  settings: android ? 'your phone’s Settings' : 'your iPhone Settings',
  /** Where to cancel a subscription. */
  cancelIn: android ? 'the Google Play Store' : 'your iPhone Settings',
};
