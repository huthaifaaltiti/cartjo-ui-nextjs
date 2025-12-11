import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Inter, Noto_Kufi_Arabic } from "next/font/google";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { isArabicLocale } from "@/config/locales.config";
import { LocaleProvider } from "@/contexts/LocaleContext";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import SessionWrapper from "@/components/SessionWrapper";
import { HomeEffectsContextProvider } from "@/contexts/HomeEffectsContext";
import { GeneralContextProvider } from "@/contexts/General.context";
import "../globals.css";
import "../../styles/prose.css";
import ReduxProvider from "../../redux/ReduxProvider";
import "leaflet/dist/leaflet.css";
import {
  METADATA_ROUTES_NAMES,
  routesMetadata,
} from "@/constants/metadata.constant";
import { Locale } from "@/types/locale";

const inter = Inter({ subsets: ["latin"] });

const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-noto-kufi",
});

export async function generateMetadata({
  params,
}: {
  params:  Promise<{ locale: Locale | string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = isArabicLocale(locale);
  const meta = routesMetadata[METADATA_ROUTES_NAMES.HOME];

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

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isArabic: boolean = isArabicLocale(locale);
  const dir = isArabic ? "rtl" : "ltr";
  const layoutFont = isArabic ? notoKufiArabic.className : inter.className;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html dir={dir} lang={locale}>
      <body className={`${layoutFont} antialiased`}>
        <ReactQueryProvider>
          <NextIntlClientProvider>
            <LocaleProvider locale={locale}>
              <SessionWrapper>
                <HomeEffectsContextProvider>
                  <Toaster
                    toastOptions={{ className: layoutFont }}
                    position={!isArabic ? "top-right" : "top-left"}
                    expand={true}
                    closeButton={false}
                  />
                  <NuqsAdapter>
                    <GeneralContextProvider>
                      <ReduxProvider>{children}</ReduxProvider>
                    </GeneralContextProvider>
                  </NuqsAdapter>
                </HomeEffectsContextProvider>
              </SessionWrapper>
            </LocaleProvider>
          </NextIntlClientProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
