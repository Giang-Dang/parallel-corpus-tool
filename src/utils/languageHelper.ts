import { COUNTRY_TO_LANGUAGE, LanguageCode, LANGUAGES } from '@/constants/languages';

export const getLanguageName = (code: LanguageCode): string => {
  return LANGUAGES[code];
};

export const getLanguageCodeFromCountry = (countryCode: string): string | null => {
  const upperCountryCode = countryCode.toUpperCase();
  return COUNTRY_TO_LANGUAGE[upperCountryCode] || null;
};

export const normalizeToLanguageCode = (suffix: string): string | null => {
  const lowerSuffix = suffix.toLowerCase() as LanguageCode;

  if (lowerSuffix in LANGUAGES) {
    return lowerSuffix;
  }

  return getLanguageCodeFromCountry(suffix);
};
