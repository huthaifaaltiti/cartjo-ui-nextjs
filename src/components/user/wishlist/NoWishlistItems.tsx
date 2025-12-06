import { memo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import assetsPaths from "@public/assets/assets.json";
import Link from "next/link";

const NoWishlistItems = () => {
  const t = useTranslations();

  return (
    <div className="w-full min-h-[70vh] h-full flex flex-col items-center justify-center px-4 text-center">
      <Image
        src={assetsPaths.image.webp.list_of_outstanding_tasks}
        alt="Empty wishlist"
        width={200}
        height={200}
        priority
      />

      <div className="mt-8 mb-6 space-y-2">
        <p className="text-2xl font-bold text-gray-800">
          {t("routes.wishlist.components.NoWishlistItems.wishlistIsEmpty")}
        </p>

        <p className="text-sm text-gray-500">
          {t(
            "routes.wishlist.components.NoWishlistItems.adviceStartAddingItems"
          )}
        </p>
      </div>

      <div className="w-full max-w-sm flex items-center justify-center gap-3 mt-10">
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

export default memo(NoWishlistItems);
