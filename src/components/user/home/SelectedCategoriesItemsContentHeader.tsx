import Link from "next/link";
import { MoveLeft, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  category: {
    _id: string;
    slug?: string;
    name: { ar: string; en: string };
  };
  isArabic: boolean;
  locale: string;
  ctaText: string;
}

export default function SelectedCategoriesItemsContentHeader({
  category,
  isArabic,
  locale,
  ctaText,
}: Props) {
  return (
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-5 mb-5">
      <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-1 sm:mb-0 capitalize">
        {isArabic ? category.name.ar : category.name.en}
      </h3>

      <Link
        href={{
          pathname: `/${locale}/${category?.slug || category?.name}`,
          query: { c_id: `${category?._id}` },
        }}
      >
        <Button
          variant="default"
          className="bg-white-200 rounded-[20px] border border-gray-100 shadow-none flex items-center gap-1 group text-[#212529] text-sm sm:text-md md:text-base lg:text-md font-bold transition-all px-3 py-1 sm:px-4 sm:py-2 hover:shadow"
        >
          <span className="capitalize">{ctaText}</span>
          {isArabic ? (
            <MoveLeft className="w-3 h-3 sm:w-4 sm:h-4 group-hover:-translate-x-2 transition-all" />
          ) : (
            <MoveRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-2 transition-all" />
          )}
        </Button>
      </Link>
    </div>
  );
}
