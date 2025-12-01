import { memo } from "react";
import { Product } from "@/types/product.type";
import ShowcaseProductRowCard from "./ShowcaseProductRowCard";
import ShowcaseProductVertCard from "./ShowcaseProductVertCard";

type Props = {
  items: Product[];
  isArabic: boolean;
};

const ShowcaseProduct121 = ({ items, isArabic }: Props) => {
  if (!items?.length) return null;

  return (
    <div className="w-full">
      {/* 🟦 Desktop layout (original 1-2-1) */}
      <div className="hidden xl:grid grid-cols-10 gap-4 w-full">
        {/* Left 1 */}
        <div className="col-span-3">
          {items[0] && (
            <ShowcaseProductVertCard item={items[0]} isArabic={isArabic} />
          )}
        </div>

        {/* Middle 2 */}
        <div className="col-span-4 flex flex-col gap-4">
          {items.slice(1, 3).map((item, idx) => (
            <ShowcaseProductRowCard
              key={`121-middle-${idx}`}
              item={item}
              isArabic={isArabic}
            />
          ))}
        </div>

        {/* Right 1 */}
        <div className="col-span-3">
          {items[3] && (
            <ShowcaseProductVertCard item={items[3]} isArabic={isArabic} />
          )}
        </div>
      </div>

      {/* 🟩 Mobile / Tablet / Small desktop layout
          Convert ALL items to vertical cards in a responsive grid */}
      <div
        className="
          grid xl:hidden 
          w-full gap-6 place-items-center
          grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
        "
      >
        {items.map((item, index) => (
          <ShowcaseProductVertCard
            key={`121-responsive-${index}`}
            item={item}
            isArabic={isArabic}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(ShowcaseProduct121);
