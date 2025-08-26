import { memo } from "react";
import ShowcaseProductRowCard from "./ShowcaseProductRowCard";
import { Product } from "@/types/product.type";

type Props = {
  items: Product[];
  isArabic: boolean;
};

const ShowcaseProduct313 = ({ items, isArabic }: Props) => {
  if (!items?.length) return null;

  return (
    <div className="grid grid-cols-3 gap-4 w-full">
      {/* Left 3 stacked */}
      <div className="flex flex-col gap-4">
        {items.slice(0, 3).map((item, idx) => (
          <ShowcaseProductRowCard
            key={`313-left-${idx}`}
            item={item}
            isArabic={isArabic}
          />
        ))}
      </div>

      {/* Middle 1 */}
      <div>
        {items[3] && (
          <ShowcaseProductRowCard
            key={`313-middle`}
            item={items[3]}
            isArabic={isArabic}
          />
        )}
      </div>

      {/* Right 3 stacked */}
      <div className="flex flex-col gap-4">
        {items.slice(4).map((item, idx) => (
          <ShowcaseProductRowCard
            key={`313-right-${idx}`}
            item={item}
            isArabic={isArabic}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(ShowcaseProduct313);
