import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import assetsPaths from "@public/assets/assets.json";

const NoCategoryItems = () => {
  const t = useTranslations();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 text-center">
      <Image
        src={assetsPaths.image.webp.empty_shopping_basket}
        alt="Empty wishlist"
        width={300}
        height={300}
        priority
      />

      <div className="mt-8 mb-6 space-y-2">
        <p className="text-2xl font-bold text-gray-800">
          {t("routes.categories.components.NoCategoryItems.empty")}
        </p>
      </div>

      <div className="w-full max-w-sm flex items-center justify-center gap-3 mt-5">
        <Link href={"/"}>
          <Button
            className="w-auto py-3 text-primary-500 bg-white-50 border border-primary-500 font-semibold hover:bg-white-500 transition-colors rounded-lg"
            type="button"
            disabled={false}
          >
            {t("general.actions.returnToHomePage")}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default memo(NoCategoryItems);
