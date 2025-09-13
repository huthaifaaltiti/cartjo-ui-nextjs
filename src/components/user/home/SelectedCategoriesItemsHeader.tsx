import { memo } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { isArabicLocale } from "@/config/locales.config";
import { MoveLeft, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const SelectedCategoriesItemsHeader = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isAr = isArabicLocale(locale);

  return (
    <div className="w-full h-auto">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-start gap-3">
          <div>
            <h3 className="text-xl text-text-primary-300 font-bold">
              {t("routes.home.components.SelectedCategoriesItemsHeader.header")}
            </h3>
          </div>
        </div>

        <Link href={"#"} target="_blank">
          <Button
            variant="default"
            className="bg-white-50 rounded-[20px] shadow-none flex items-center gap-1 group text-[#212529] font-bold transition-all"
          >
            {t(
              "routes.home.components.SelectedCategoriesItemsHeader.ctaBtnText"
            )}
            {isAr ? (
              <MoveLeft className="w-3 h-3 group-hover:-translate-x-1 transition-all" />
            ) : (
              <MoveRight className="w-3 h-3 group-hover:translate-x-1 transition-all" />
            )}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default memo(SelectedCategoriesItemsHeader);
