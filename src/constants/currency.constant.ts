export const Currency = {
  JOD: {
    code: "JOD",
    labelAr: "دينار أردني",
    labelEn: "JO Dinar",
    shortAr: "دأ",
    shortEn: "JD",
  },
  USD: {
    code: "USD",
    labelAr: "دولار أمريكي",
    labelEn: "US Dollar",
    shortAr: "دإ",
    shortEn: "US",
  },
} as const;

export type CurrencyKey = keyof typeof Currency;

/* 
 typeof Currency gets the type of the object:

 typeof Currency
  {
    readonly JOD: { readonly code: "JOD"; readonly labelAr: "دينار أردني" };
    readonly USD: { readonly code: "USD"; readonly labelAr: "دولار أمريكي" };
  }


 keyof extracts the keys of this object as a union type:

 keyof typeof Currency => "JOD" | "USD"

 So when you write: export type CurrencyKey = keyof typeof Currency; You’re creating a type called CurrencyKey that can only be "JOD" or "USD".
*/
