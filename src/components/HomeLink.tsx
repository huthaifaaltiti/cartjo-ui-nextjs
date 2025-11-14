"use client";

import { memo } from "react";
import { House } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const HomeLink: React.FC = () => {
  const { isArabic } = useSelector((state: RootState) => state.general);

  return (
    <div
      className={`flex items-center border-0 ${
        isArabic
          ? "sm:border-l sm:border-gray-200 sm:pl-3"
          : "sm:border-r sm:border-gray-200 sm:pr-3"
      }`}
    >
      <Link href="/" aria-label="Go to homepage">
        <House className="w-7 h-7 sm:w-6 sm:h-6  text-primary-500 hover:text-primary-600 cursor-pointer transition-colors duration-200" />
      </Link>
    </div>
  );
};

export default memo(HomeLink);
