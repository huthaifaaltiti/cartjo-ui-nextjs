import { memo, ReactNode } from "react";
import { MoveRight, MoveLeft } from "lucide-react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { isArabicLocale } from "@/config/locales.config";

type ShowcaseSectionProps = {
  header: string;
  desc: string;
  btnText: string;
  uri: string;
  children: ReactNode;
};

const ShowcaseSection = ({
  header,
  desc,
  uri,
  btnText,
  children,
}: ShowcaseSectionProps) => {
  const locale = useLocale();
  const isAr = isArabicLocale(locale);

  return (
    <div className="w-full h-auto px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <h3 className="text-md sm:text-lg md:text-xl lg:text-2xl text-text-primary-400 font-extrabold">
            {header}
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary-200 mt-1 sm:mt-0">
            {desc}
          </p>
        </div>

        <Link href={uri} target="_blank">
          <Button
            variant="default"
            className="bg-white-50 rounded-[20px] border border-gray-100 shadow-none flex items-center gap-1 group text-xs sm:text-sm md:text-base lg:text-sm font-bold hover:shadow transition-all px-3 py-1 sm:px-4 sm:py-2"
          >
            {btnText}
            {isAr ? (
              <MoveLeft className="w-3 h-3 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-all" />
            ) : (
              <MoveRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-all" />
            )}
          </Button>
        </Link>
      </div>

      <div className="w-full mt-5">{children}</div>
    </div>
  );
};

export default memo(ShowcaseSection);
