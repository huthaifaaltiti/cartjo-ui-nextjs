import { isArabicLocale } from "@/config/locales.config";
import {
  METADATA_ROUTES_NAMES,
  routesMetadata,
} from "@/constants/metadata.constant";
import { Locale } from "@/types/locale";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params:  Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = isArabicLocale(locale);
  const meta = routesMetadata[METADATA_ROUTES_NAMES.AUTH];

  return {
    title: isArabic ? meta.title.ar : meta.title.en,
    description: isArabic ? meta.description.ar : meta.description.en,

    openGraph: {
      title: isArabic ? meta.title.ar : meta.title.en,
      description: isArabic ? meta.description.ar : meta.description.en,
      locale: isArabic ? "ar" : "en",
      type: "website",
    },

    alternates: {
      canonical: `/${locale}`,
      languages: {
        ar: "/ar",
        en: "/en",
      },
    },
  };
}

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full h-full min-h-screen">{children}</div>;
}
