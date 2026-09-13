export interface ThemeColorPreset {
  name: {
    en: string;
    ar: string;
  };
  hex: string;
}

export const THEME_COLOR_PRESETS: ThemeColorPreset[] = [
  { name: { en: "CartJO Purple", ar: "بنفسجي كارتجو" }, hex: "#7c3aed" },
  { name: { en: "Royal Blue", ar: "أزرق ملكي" }, hex: "#2563eb" },
  { name: { en: "Ocean Teal", ar: "تيل محيطي" }, hex: "#0891b2" },
  { name: { en: "Emerald Green", ar: "أخضر زمردي" }, hex: "#059669" },
  { name: { en: "Amber Gold", ar: "ذهبي دافئ" }, hex: "#d97706" },
  { name: { en: "Sunset Orange", ar: "برتقالي الغروب" }, hex: "#ea580c" },
  { name: { en: "Rose Pink", ar: "وردي" }, hex: "#e11d48" },
  { name: { en: "Midnight Slate", ar: "رمادي داكن" }, hex: "#0f172a" },
];
