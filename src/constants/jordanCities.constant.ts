interface City {
  value: string;
  label: {
    en: string;
    ar: string;
  };
  deliveryCost?: number;
}

export const jordanCities: City[] = [
  { value: "amm", label: { en: "Amman", ar: "عمّان" }, deliveryCost: 3 },
  { value: "zar", label: { en: "Zarqa", ar: "الزرقاء" }, deliveryCost: 3 },
  { value: "irb", label: { en: "Irbid", ar: "إربد" }, deliveryCost: 3 },
  { value: "aqa", label: { en: "Aqaba", ar: "العقبة" }, deliveryCost: 4 },
  { value: "jer", label: { en: "Jerash", ar: "جرش" }, deliveryCost: 3 },
  { value: "maf", label: { en: "Mafraq", ar: "المفرق" }, deliveryCost: 3 },
  { value: "sal", label: { en: "Salt", ar: "السلط" }, deliveryCost: 3 },
  { value: "mad", label: { en: "Madaba", ar: "مأدبا" }, deliveryCost: 3 },
  { value: "kar", label: { en: "Karak", ar: "الكرك" }, deliveryCost: 4 },
  { value: "taf", label: { en: "Tafilah", ar: "الطفيلة" }, deliveryCost: 4 },
  { value: "maa", label: { en: "Ma'an", ar: "معان" }, deliveryCost: 4 },
  { value: "ajl", label: { en: "Ajloun", ar: "عجلون" }, deliveryCost: 4 },
];
