import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Inter, Noto_Kufi_Arabic } from "next/font/google";
import { Toaster } from "sonner";

import { routing } from "@/i18n/routing";

import "../globals.css";

import { LocaleProvider } from "@/contexts/LocaleContext";

import TopBar from "@/components/TopBar";
import ReactQueryProvider from "@/components/ReactQueryProvider";

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
  const isArabic = locale === "ar";
  const dir = locale === "ar" ? "rtl" : "ltr";

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html dir={dir} lang={locale}>
      <body
        className={`${
          isArabic ? notoKufiArabic.className : inter.className
        } antialiased`}
      >
        <ReactQueryProvider>
          <NextIntlClientProvider>
            <LocaleProvider locale={locale}>
              <Toaster
                position={isArabic ? "top-right" : "top-left"}
                expand={true}
                closeButton={false}
              />
              <TopBar />
              {children}
            </LocaleProvider>
          </NextIntlClientProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
