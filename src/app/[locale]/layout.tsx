import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Inter, Noto_Kufi_Arabic } from "next/font/google";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import "../globals.css";
import { isArabicLocale } from "@/config/locales.config";
import { LocaleProvider } from "@/contexts/LocaleContext";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import SessionWrapper from "@/components/SessionWrapper";
import { HomeEffectsContextProvider } from "@/contexts/HomeEffectsContext";

const inter = Inter({ subsets: ["latin"] });

const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-noto-kufi",
});

export const metadata: Metadata = {
  title: "Digital Library JO",
  description: "An e-commerce application based in Jordan",
};

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
                  <NuqsAdapter>{children}</NuqsAdapter>
                </HomeEffectsContextProvider>
              </SessionWrapper>
            </LocaleProvider>
          </NextIntlClientProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
