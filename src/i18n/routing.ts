// import { notFound } from "next/navigation";
// import { getRequestConfig } from "next-intl/server";

// const locales = ["en", "ar"];

// export default getRequestConfig(async ({ locale }) => {
//   console.log({ locale });
//   if (!locales.includes(locale as any)) notFound();

//   return {
//     messages: (await import(`@/locales/${locale}.json`)).default,
//   };
// });

import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar"],

  defaultLocale: "ar",
});
