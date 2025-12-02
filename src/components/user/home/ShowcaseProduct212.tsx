import { memo } from "react";
import { Product } from "@/types/product.type";
import ShowcaseProductRowCard from "./ShowcaseProductVertCard";
import ShowcaseProductVertCard from "./ShowcaseProductRowCard";

type Props = {
  items: Product[];
  isArabic: boolean;
};

const ShowcaseProduct212 = ({ items, isArabic }: Props) => {
  if (!items?.length) return null;

  return (
    <div className="w-full h-auto">
      <div className="hidden lg:grid grid-cols-11 gap-4 w-full">
        {/* Left 2 stacked - Takes 2 columns */}
        <div className="col-span-4 flex flex-col gap-4">
          {items.slice(0, 2).map((item, idx) => (
            <ShowcaseProductVertCard
              key={`313-left-${idx}`}
              item={item}
              isArabic={isArabic}
            />
          ))}
        </div>

        {/* Middle 1 - Takes 1 column */}
        <div className="col-span-3">
          {items[2] && (
            <ShowcaseProductRowCard
              key={`313-middle`}
              item={items[2]}
              isArabic={isArabic}
            />
          )}
        </div>

        {/* Right 2 stacked - Takes 2 columns */}
        <div className="col-span-4 flex flex-col gap-4">
          {items.slice(3).map((item, idx) => (
            <ShowcaseProductVertCard
              key={`313-right-${idx}`}
              item={item}
              isArabic={isArabic}
            />
          ))}
        </div>
      </div>

      <div
        className="
          grid lg:hidden 
          w-full gap-6 place-items-center max-[300px]:grid-cols-1
          grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
        "
      >
        {items.map((item, index) => (
          <ShowcaseProductRowCard
            key={`212-responsive-${index}`}
            item={item}
            isArabic={isArabic}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(ShowcaseProduct212);
