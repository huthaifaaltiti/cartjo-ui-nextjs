// ShowcaseProductOneThreeOne.tsx
import { memo } from "react";
import ShowcaseProductRowCard from "./ShowcaseProductRowCard";
import { Product } from "@/types/product.type";

type Props = {
  items: Product[];
  isArabic: boolean;
};

const ShowcaseProduct131 = ({ items, isArabic }: Props) => {
  if (!items?.length) return null;

  return (
    <div className="grid grid-cols-3 gap-4 w-full">
      {/* Left 1 */}
      <div>
        {items[0] && (
          <ShowcaseProductRowCard
            key={`131-left`}
            item={items[0]}
            isArabic={isArabic}
          />
        )}
      </div>

      {/* Middle 3 stacked */}
      <div className="flex flex-col gap-4">
        {items.slice(1, 4).map((item, idx) => (
          <ShowcaseProductRowCard
            key={`131-middle-${idx}`}
            item={item}
            isArabic={isArabic}
          />
        ))}
      </div>

      {/* Right 1 */}
      <div>
        {items[4] && (
          <ShowcaseProductRowCard
            key={`131-right`}
            item={items[4]}
            isArabic={isArabic}
          />
        )}
      </div>
    </div>
  );
};

export default memo(ShowcaseProduct131);
