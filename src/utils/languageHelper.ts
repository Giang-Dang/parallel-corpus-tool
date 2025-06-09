import { LanguageCode, LANGUAGES } from "@/constants/languages";

export const getLanguageName = (code: LanguageCode): string => {
  return LANGUAGES[code];
};

