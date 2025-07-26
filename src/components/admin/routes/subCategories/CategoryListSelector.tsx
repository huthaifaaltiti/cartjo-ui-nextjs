"use client";

import { memo } from "react";
import { useLocale, useTranslations } from "next-intl";

import { Category } from "@/types/category";

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { useSubCategories } from "@/contexts/SubCategoriesContext";

type CategoriesListProps = {
  categoriesList: Category[];
};

const CategoryListSelector = ({ categoriesList }: CategoriesListProps) => {
  const { selectedCatId, setSelectedCatId } = useSubCategories();
  const locale = useLocale();
  const t = useTranslations();
  const isArabic = locale === "ar";

  return (
    <div className="w-full md:max-w-sm px-2 md:px-0">
      <Select
        value={selectedCatId ?? "__all__"}
        onValueChange={(value) =>
          setSelectedCatId?.(value === "__all__" ? undefined : value)
        }
      >
        <SelectTrigger className="w-full text-text-primary-100 text-sm shadow-none">
          <SelectValue
            placeholder={t(
              "routes.dashboard.routes.subCategories.components.CategoryListSelector.select.all"
            )}
          />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="__all__">
            {t(
              "routes.dashboard.routes.subCategories.components.CategoryListSelector.select.one"
            )}
          </SelectItem>
          {categoriesList.map((cat) => (
            <SelectItem
              key={cat._id}
              value={cat._id}
              className="cursor-pointer capitalize"
            >
              {isArabic ? cat.name.ar : cat.name.en}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default memo(CategoryListSelector);
