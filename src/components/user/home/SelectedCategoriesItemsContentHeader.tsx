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
    <div className="w-full flex items-center justify-between gap-5 mb-5">
      <h3 className="text-lg font-semibold mb-2">
        {isArabic ? category.name.ar : category.name.en}
      </h3>

      <Link
        href={{
          pathname: `/${locale}/${category?.slug || category?.name}`,
          query: { c_id: `${category?._id}` },
        }}
        target="_blank"
      >
        <Button
          variant="default"
          className="bg-white-50 rounded-[20px] shadow-none flex items-center gap-1 group text-[#212529] text-md font-bold transition-all"
        >
          {ctaText}
          {isArabic ? (
            <MoveLeft className="w-4 h-4 group-hover:-translate-x-2 transition-all" />
          ) : (
            <MoveRight className="w-4 h-4 group-hover:translate-x-2 transition-all" />
          )}
        </Button>
      </Link>
    </div>
  );
}
