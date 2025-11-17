interface City {
  value: string;
  label: {
    en: string;
    ar: string;
  };
}

export const jordanCities: City[] = [
  { value: "amman", label: { en: "Amman", ar: "عمّان" } },
  { value: "zarqa", label: { en: "Zarqa", ar: "الزرقاء" } },
  { value: "irbid", label: { en: "Irbid", ar: "إربد" } },
  { value: "aqaba", label: { en: "Aqaba", ar: "العقبة" } },
  { value: "jerash", label: { en: "Jerash", ar: "جرش" } },
  { value: "mafraq", label: { en: "Mafraq", ar: "المفرق" } },
  { value: "salt", label: { en: "Salt", ar: "السلط" } },
  { value: "madaba", label: { en: "Madaba", ar: "مأدبا" } },
  { value: "karak", label: { en: "Karak", ar: "الكرك" } },
  { value: "tafilah", label: { en: "Tafilah", ar: "الطفيلة" } },
  { value: "maan", label: { en: "Ma'an", ar: "معان" } },
  { value: "ajloun", label: { en: "Ajloun", ar: "عجلون" } }
];
