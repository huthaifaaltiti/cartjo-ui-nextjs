"use client";

import { Locale } from "@/enums/locale.enum";
import { Inter, Noto_Kufi_Arabic } from "next/font/google";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-noto-kufi",
});

export default function ClientFontSetter({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isArabic, setIsArabic] = useState<boolean>(false);

  useEffect(() => {
    const url = document.URL;
    const isArabic = url.includes(`/${Locale.AR}/`);

    setIsArabic(isArabic);
  }, []);

  const layoutFont = isArabic ? notoKufiArabic.className : inter.className;

  return <div className={layoutFont}>{children}</div>;
}
