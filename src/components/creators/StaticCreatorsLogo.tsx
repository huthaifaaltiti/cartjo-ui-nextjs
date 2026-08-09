"use client";

import { RootState } from "@/redux/store";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function StaticCreatorsLogo({
  isArabic,
}: {
  isArabic: boolean;
}) {
  const storedIsArabic = useSelector(
    (state: RootState) => state.general.isArabic,
  );
  const fallbackIsArabic = isArabic || storedIsArabic;

  const logoSrc = `/assets/image/png/creators/logo/creators_page_logo_${
    isArabic ? "ar" : "en"
  }.png`;

  return (
    <Image
      src={logoSrc}
      alt={fallbackIsArabic ? "شعار المبدعين" : "Creators Logo"}
      width={150}
      height={60}
      priority
    />
  );
}
