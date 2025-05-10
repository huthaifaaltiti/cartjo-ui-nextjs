import enLocale from "../locales/en.json";
import arLocale from "../locales/ar.json";

export const locales = {
  en: enLocale,
  ar: arLocale,
};

type LocaleKey = keyof typeof locales;
export type TranslationObject = { [key: string]: string | TranslationObject };

// Internal function: gets translation object from locales
const getLocaleData = (locale: string): TranslationObject => {
  const fallback = "en";
  const key: LocaleKey = (locale in locales ? locale : fallback) as LocaleKey;
  return locales[key];
};

// Internal function: retrieves value by dot-notated path
const getTranslation = (
  locale: TranslationObject,
  path: string,
  defaultValue: string = path
): string => {
  const keys = path.split(".");
  let current: string | TranslationObject = locale;

  for (const key of keys) {
    if (typeof current !== "object" || current === null || !(key in current)) {
      return defaultValue;
    }
    current = (current as TranslationObject)[key];
  }

  return typeof current === "string" ? current : defaultValue;
};

// ✅ Exported function to create a simple `t(key)` function
export const createTranslator = (locale: string) => {
  const localeData = getLocaleData(locale);

  console.log("createTranslator", locale);

  return (key: string, defaultValue: string = key) =>
    getTranslation(localeData, key, defaultValue);
};
