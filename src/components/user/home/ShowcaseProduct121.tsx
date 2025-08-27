// ShowcaseProduct121.tsx
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
    <div className="grid grid-cols-10 gap-4 w-full">
      {/* Left 1 */}
      <div className="col-span-3">
        {items[0] && (
          <ShowcaseProductVertCard
            key={`121-left`}
            item={items[0]}
            isArabic={isArabic}
          />
        )}
      </div>

      {/* Middle 2 stacked */}
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
          <ShowcaseProductVertCard
            key={`121-right`}
            item={items[3]}
            isArabic={isArabic}
          />
        )}
      </div>
    </div>
  );
};

export default memo(ShowcaseProduct121);
