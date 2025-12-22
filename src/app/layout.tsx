import { NextIntlClientProvider } from "next-intl";
import ClientFontSetter from "@/components/shared/ClientFontSetter";
import "./globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <NextIntlClientProvider>
          <ClientFontSetter>
            {children}
          </ClientFontSetter>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
