"use client";

import { memo } from "react";

import { Category } from "@/types/category";
import { useSubCategories } from "@/contexts/SubCategoriesContext";

type CategoriesListProps = {
  categoriesList: Category[];
};

const CategoryListSelector = ({ categoriesList }: CategoriesListProps) => {
  const { selectedCatId, setSelectedCatId } = useSubCategories();

  return (
    <div className="my-4">
      <label htmlFor="category-select" className="block mb-1 font-medium">
        Select Category:
      </label>
      <select
        id="category-select"
        className="border px-3 py-2 rounded w-full max-w-sm"
        value={selectedCatId || ""}
        onChange={(e) => setSelectedCatId?.(e.target.value || undefined)}
      >
        <option value="">All Categories</option>
        {categoriesList.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name.en}
          </option>
        ))}
      </select>
    </div>
  );
};

export default memo(CategoryListSelector);
