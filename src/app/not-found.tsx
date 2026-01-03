"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Search, CircleAlert } from "lucide-react";
import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { isArabicLocale } from "@/config/locales.config";
import { Locale } from "@/types/locale";

export default function NotFound() {
  const t = useTranslations("routes.notFound");
  const router = useRouter();
  const pathname = usePathname();

  const [isArabic, setIsArabic] = useState<boolean>(false);

  useEffect(() => {
    if (pathname) {
      const locale = pathname.split("/")[1] as Locale;

      setIsArabic(isArabicLocale(locale));
    }
  }, [pathname]);

  return (
    <MaxWidthWrapper>
      <div className="min-h-screen px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Icon and Status */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-primary-50 rounded-full mb-6">
              <CircleAlert className="w-12 h-12 text-primary-600" />
            </div>

            <h1 className="text-[8rem] font-bold text-primary-500 mb-3">
              {" "}
              {t("status")}
            </h1>
            <h2 className="text-2xl font-semibold text-slate-800 mb-3">
              {t("header")}
            </h2>
            <p className="text-slate-600 text-lg">{t("description")}</p>
          </div>

          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <button
              onClick={() => router.back()}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border-2 border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
            >
              {t("actions.goBack")}
            </button>

            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-primary-500 text-white-50 font-medium hover:bg-primary-600 transition shadow-sm"
            >
              <Home className="w-5 h-5" />
              {t("actions.backToHome")}
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mb-12">
            <div className="relative">
              <Search
                className={`absolute ${
                  isArabic ? "right-4" : "left-4"
                } top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400`}
              />
              <input
                type="text"
                dir={isArabic ? "rtl" : "ltr"}
                placeholder={t("search.placeholder")}
                className="w-full !px-12 pr-4 py-4 rounded-lg border-2 border-slate-200 focus:border-primary-500 focus:outline-none text-slate-700 placeholder-slate-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value) {
                    router.push(
                      `/search?q=${encodeURIComponent(
                        e.currentTarget?.value?.trim()
                      )}`
                    );
                  }
                }}
              />
            </div>
          </div>

          {/* Help Text */}
          <p className="text-center text-slate-500 text-sm mt-8">
            {t("help.text")}{" "}
            <Link
              href="/support"
              className="text-primary-600 hover:text-primary-700 font-medium underline"
            >
              {t("help.support")}
            </Link>
          </p>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
