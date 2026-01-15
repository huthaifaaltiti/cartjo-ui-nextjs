export const PreferredLanguage = {
  AR: { labelAr: "العربية", labelEn: "Arabic" },
  EN: { labelAr: "الإنجليزية", labelEn: "English" },
} as const;

export type PreferredLanguageKey = keyof typeof PreferredLanguage;
