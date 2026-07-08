// Language codes follow Microsoft Translator's supported list. If you swap
// RapidAPI providers, double-check these codes still match theirs.
export const LANGUAGES = [
  { code: 'auto', name: 'Auto Detect', flag: '🌐' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh-Hans', name: 'Chinese (Simplified)', flag: '🇨🇳' },
  { code: 'zh-Hant', name: 'Chinese (Traditional)', flag: '🇹🇼' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'el', name: 'Greek', flag: '🇬🇷' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱' },
  { code: 'cs', name: 'Czech', flag: '🇨🇿' },
  { code: 'da', name: 'Danish', flag: '🇩🇰' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴' },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺' },
];

// BCP-47 locale tags for the Web Speech APIs — deliberately mapped by hand
// rather than derived (e.g. "en" -> "en-EN" would be wrong; it must be "en-US").
const SPEECH_LOCALES = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  it: 'it-IT',
  pt: 'pt-PT',
  ru: 'ru-RU',
  ja: 'ja-JP',
  ko: 'ko-KR',
  'zh-Hans': 'zh-CN',
  'zh-Hant': 'zh-TW',
  ar: 'ar-SA',
  hi: 'hi-IN',
  bn: 'bn-BD',
  tr: 'tr-TR',
  nl: 'nl-NL',
  sv: 'sv-SE',
  pl: 'pl-PL',
  vi: 'vi-VN',
  th: 'th-TH',
  id: 'id-ID',
  el: 'el-GR',
  he: 'he-IL',
  cs: 'cs-CZ',
  da: 'da-DK',
  fi: 'fi-FI',
  uk: 'uk-UA',
  ro: 'ro-RO',
  hu: 'hu-HU',
};

export function getLanguageByCode(code) {
  return LANGUAGES.find((lang) => lang.code === code);
}

export function getLanguageName(code) {
  return getLanguageByCode(code)?.name || code || 'Unknown';
}

export function getLanguageFlag(code) {
  return getLanguageByCode(code)?.flag || '🏳️';
}

export function getSpeechLocale(code) {
  return SPEECH_LOCALES[code] || 'en-US';
}
