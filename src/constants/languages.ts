export const COUNTRY_TO_LANGUAGE: Record<string, string> = {
  // Major Countries
  US: 'en', // United States -> English
  GB: 'en', // United Kingdom -> English
  EN: 'en', // England (alternative) -> English
  AU: 'en', // Australia -> English
  CA: 'en', // Canada -> English (primary)
  IE: 'ga', // Ireland -> Irish
  CN: 'zh', // China -> Chinese
  TW: 'zh', // Taiwan -> Chinese
  HK: 'zh', // Hong Kong -> Chinese
  IN: 'hi', // India -> Hindi (primary)
  ES: 'es', // Spain -> Spanish
  MX: 'es', // Mexico -> Spanish
  AR: 'es', // Argentina -> Spanish
  FR: 'fr', // France -> French
  SA: 'ar', // Saudi Arabia -> Arabic
  EG: 'ar', // Egypt -> Arabic
  BD: 'bn', // Bangladesh -> Bengali
  RU: 'ru', // Russia -> Russian
  PT: 'pt', // Portugal -> Portuguese
  BR: 'pt', // Brazil -> Portuguese
  ID: 'id', // Indonesia -> Indonesian
  PK: 'ur', // Pakistan -> Urdu
  DE: 'de', // Germany -> German
  AT: 'de', // Austria -> German
  CH: 'de', // Switzerland -> German (primary)
  JP: 'ja', // Japan -> Japanese
  KE: 'sw', // Kenya -> Swahili
  TZ: 'sw', // Tanzania -> Swahili
  LK: 'ta', // Sri Lanka -> Tamil
  VN: 'vn', // Vietnam -> Vietnamese
  KR: 'ko', // South Korea -> Korean
  IT: 'it', // Italy -> Italian
  TH: 'th', // Thailand -> Thai
  PL: 'pl', // Poland -> Polish
  UA: 'uk', // Ukraine -> Ukrainian
  TR: 'tr', // Turkey -> Turkish
  NL: 'nl', // Netherlands -> Dutch
  BE: 'nl', // Belgium -> Dutch (primary)
  HU: 'hu', // Hungary -> Hungarian
  CZ: 'cs', // Czech Republic -> Czech
  SE: 'sv', // Sweden -> Swedish
  BY: 'be', // Belarus -> Belarusian
  GR: 'el', // Greece -> Greek
  IL: 'he', // Israel -> Hebrew
  FI: 'fi', // Finland -> Finnish
  NO: 'no', // Norway -> Norwegian
  DK: 'da', // Denmark -> Danish
  BG: 'bg', // Bulgaria -> Bulgarian
  HR: 'hr', // Croatia -> Croatian
  SK: 'sk', // Slovakia -> Slovak
  SI: 'sl', // Slovenia -> Slovenian
  EE: 'et', // Estonia -> Estonian
  LV: 'lv', // Latvia -> Latvian
  LT: 'lt', // Lithuania -> Lithuanian
  MK: 'mk', // North Macedonia -> Macedonian
  MT: 'mt', // Malta -> Maltese
  IS: 'is', // Iceland -> Icelandic
  AL: 'sq', // Albania -> Albanian

  // African Countries
  ET: 'am', // Ethiopia -> Amharic
  NG: 'ha', // Nigeria -> Hausa (primary)
  ZA: 'zu', // South Africa -> Zulu (primary)
  RW: 'rw', // Rwanda -> Kinyarwanda
  BI: 'rn', // Burundi -> Kirundi
  UG: 'lg', // Uganda -> Luganda
  ZW: 'sn', // Zimbabwe -> Shona
  MW: 'ny', // Malawi -> Chichewa
  LS: 'st', // Lesotho -> Sesotho
  BW: 'tn', // Botswana -> Setswana
  SZ: 'ss', // Eswatini -> Siswati

  // Asian Countries
  MM: 'my', // Myanmar -> Burmese
  KH: 'km', // Cambodia -> Khmer
  LA: 'lo', // Laos -> Lao
  NP: 'ne', // Nepal -> Nepali
  AF: 'ps', // Afghanistan -> Pashto
  IR: 'fa', // Iran -> Persian
  TJ: 'tg', // Tajikistan -> Tajik
  UZ: 'uz', // Uzbekistan -> Uzbek
  KZ: 'kk', // Kazakhstan -> Kazakh
  KG: 'ky', // Kyrgyzstan -> Kyrgyz
  TM: 'tk', // Turkmenistan -> Turkmen
  MN: 'mn', // Mongolia -> Mongolian
  ER: 'ti', // Eritrea -> Tigrinya
  MV: 'dv', // Maldives -> Dhivehi

  // Pacific Countries
  FJ: 'fj', // Fiji -> Fijian
  TO: 'to', // Tonga -> Tongan
  WS: 'sm', // Samoa -> Samoan
  NZ: 'mi', // New Zealand -> Maori

  // American Countries
  PE: 'qu', // Peru -> Quechua
  PY: 'gn', // Paraguay -> Guarani
  BO: 'ay', // Bolivia -> Aymara

  // European Countries (Additional)
  FO: 'fo', // Faroe Islands -> Faroese
  LU: 'lb', // Luxembourg -> Luxembourgish

  // Middle Eastern Countries
  IQ: 'ku', // Iraq -> Kurdish
  AZ: 'az', // Azerbaijan -> Azerbaijani
  GE: 'ka', // Georgia -> Georgian
  AM: 'hy', // Armenia -> Armenian

  // Special Cases
  EU: 'eo', // European Union -> Esperanto
  VA: 'la', // Vatican -> Latin
} as const;

export const LANGUAGES = {
  // Major World Languages
  en: "English",
  zh: "Chinese",
  hi: "Hindi",
  es: "Spanish",
  fr: "French",
  ar: "Arabic",
  bn: "Bengali",
  ru: "Russian",
  pt: "Portuguese",
  id: "Indonesian",
  ur: "Urdu",
  de: "German",
  ja: "Japanese",
  sw: "Swahili",
  mr: "Marathi",
  te: "Telugu",
  tr: "Turkish",
  ta: "Tamil",
  vn: "Vietnamese",
  ko: "Korean",
  it: "Italian",
  th: "Thai",
  gu: "Gujarati",
  pl: "Polish",
  uk: "Ukrainian",
  ml: "Malayalam",
  kn: "Kannada",
  or: "Odia",
  pa: "Punjabi",
  ro: "Romanian",
  nl: "Dutch",
  hu: "Hungarian",
  cs: "Czech",
  sv: "Swedish",
  be: "Belarusian",
  el: "Greek",
  he: "Hebrew",
  fi: "Finnish",
  no: "Norwegian",
  da: "Danish",
  bg: "Bulgarian",
  hr: "Croatian",
  sk: "Slovak",
  sl: "Slovenian",
  et: "Estonian",
  lv: "Latvian",
  lt: "Lithuanian",
  mk: "Macedonian",
  mt: "Maltese",
  ga: "Irish",
  cy: "Welsh",
  is: "Icelandic",
  sq: "Albanian",
  eu: "Basque",
  ca: "Catalan",
  gl: "Galician",
  
  // African Languages
  am: "Amharic",
  ha: "Hausa",
  ig: "Igbo",
  yo: "Yoruba",
  zu: "Zulu",
  xh: "Xhosa",
  af: "Afrikaans",
  rw: "Kinyarwanda",
  rn: "Kirundi",
  lg: "Luganda",
  sn: "Shona",
  ny: "Chichewa",
  st: "Sesotho",
  tn: "Setswana",
  ts: "Xitsonga",
  ss: "Siswati",
  ve: "Tshivenda",
  nr: "Ndebele",
  
  // Asian Languages
  my: "Burmese",
  km: "Khmer",
  lo: "Lao",
  si: "Sinhala",
  ne: "Nepali",
  as: "Assamese",
  sd: "Sindhi",
  ps: "Pashto",
  fa: "Persian",
  tg: "Tajik",
  uz: "Uzbek",
  kk: "Kazakh",
  ky: "Kyrgyz",
  tk: "Turkmen",
  mn: "Mongolian",
  ti: "Tigrinya",
  dv: "Dhivehi",
  
  // Pacific Languages
  fj: "Fijian",
  to: "Tongan",
  sm: "Samoan",
  mi: "Maori",
  
  // American Indigenous Languages
  qu: "Quechua",
  gn: "Guarani",
  ay: "Aymara",
  
  // Additional European Languages
  fo: "Faroese",
  se: "Northern Sami",
  rm: "Romansh",
  lb: "Luxembourgish",
  gd: "Scottish Gaelic",
  kw: "Cornish",
  br: "Breton",
  oc: "Occitan",
  co: "Corsican",
  sc: "Sardinian",
  
  // Middle Eastern Languages
  ku: "Kurdish",
  az: "Azerbaijani",
  ka: "Georgian",
  hy: "Armenian",
  yi: "Yiddish",
  
  // Central Asian Languages
  bo: "Tibetan",
  ug: "Uyghur",
  
  // Other Languages
  eo: "Esperanto",
  la: "Latin",
  sa: "Sanskrit"
} as const;

export type LanguageCode = keyof typeof LANGUAGES;
