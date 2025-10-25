"use client";

import { memo } from "react";
import { House } from "lucide-react";
import Link from "next/link";
import { useGeneralContext } from "@/contexts/General.context";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const HomeLink: React.FC = () => {
  const { isArabic } = useGeneralContext();
  const { locale, dir } = useSelector((state: RootState) => state.general);
  console.log({locale, dir})

  return (
    <div
      className={`flex items-center ${
        isArabic
          ? "border-l border-gray-200 pl-3"
          : "border-r border-gray-200 pr-3"
      }`}
    >
      <Link href="/" aria-label="Go to homepage">
        <House className="w-6 h-6 text-primary-500 hover:text-primary-600 cursor-pointer transition-colors duration-200" />
      </Link>
    </div>
  );
};

export default memo(HomeLink);
