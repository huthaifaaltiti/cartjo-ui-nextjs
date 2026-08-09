"use client";

import Image from "next/image";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export default function StaticCreatorsLogo() {
  const isArabic = useSelector((state: RootState) => state.general.isArabic);

  const logoSrc = `/assets/image/png/creators/logo/creators_page_logo_${
    isArabic ? "ar" : "en"
  }.png`;

  return (
    <Image
      src={logoSrc}
      alt={isArabic ? "شعار المبدعين" : "Creators Logo"}
      width={150}
      height={60}
      priority
    />
  );
}
