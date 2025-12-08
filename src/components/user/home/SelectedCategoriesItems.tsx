import { memo } from "react";
import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import SelectedCategoriesItemsHeader from "./SelectedCategoriesItemsHeader";
import SelectedCategoriesItemsContent from "./SelectedCategoriesItemsContent";
import { Category } from "@/types/category.type";
import { LoggedUserWishlistProvider } from "@/contexts/LoggedUserWishList.context";

const SelectedCategoriesItems = ({
  randomCategories,
}: {
  randomCategories: Category[];
}) => {
  return (
    <MaxWidthWrapper className="w-full py-8 border-t">
      <div className="w-full h-auto flex flex-col gap-8">
        <SelectedCategoriesItemsHeader />
        <LoggedUserWishlistProvider>
          <SelectedCategoriesItemsContent randomCategories={randomCategories} />
        </LoggedUserWishlistProvider>
      </div>
    </MaxWidthWrapper>
  );
};

export default memo(SelectedCategoriesItems);
