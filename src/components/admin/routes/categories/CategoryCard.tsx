import { memo } from "react";
import Image from "next/image";

import { Category } from "@/types/category";
import { DeletingResponse, SwitchActiveStatusResponse } from "@/types/common";
import CategoryCardActions from "./CategoryCardActions";

type CategoryCardProps = {
  item: Category;
  deleteCategory: (
    accessToken: string,
    userId: string
  ) => Promise<DeletingResponse>;
  unDeleteCategory: (
    accessToken: string,
    userId: string
  ) => Promise<DeletingResponse>;
  accessToken: string;
  switchCategoryActiveStatus: (
    token: string,
    lang: string,
    isActive: boolean,
    userId: string
  ) => Promise<SwitchActiveStatusResponse>;
  queryKey: string;
};

const CategoryCard = ({
  item: category,
  deleteCategory,
  unDeleteCategory,
  accessToken,
  switchCategoryActiveStatus,
  queryKey,
}: CategoryCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 border border-gray-200">
            <Image
              src={category.image}
              alt={category.name.en}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 capitalize">
              {category.name.ar}
            </h3>
            <p className="text-xs text-gray-600">{category.name.en}</p>
          </div>
        </div>

        <span className="w-auto flex items-center gap-1">
          <span
            className={`px-[5px] py-[0.8px] text-[10px] rounded-full ${
              category.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {category.isActive ? "Active" : "Inactive"}
          </span>

          {category.isDeleted && (
            <span className="ml-2 px-[5px] py-[0.8px] text-[10px] rounded-full bg-gray-200 text-gray-700">
              Deleted
            </span>
          )}
        </span>
      </div>

      <div className="text-xs text-gray-600 mb-4 space-y-1">
        <p>
          Created: {new Date(category.createdAt).toLocaleDateString("en-US")}
        </p>
        {category.updatedAt && (
          <p>
            Updated: {new Date(category.updatedAt).toLocaleDateString("en-US")}
          </p>
        )}
      </div>

      <div className="mt-auto">
        <CategoryCardActions
          category={category}
          deleteUser={deleteCategory}
          unDeleteUser={unDeleteCategory}
          accessToken={accessToken}
          switchUserActiveStatus={switchCategoryActiveStatus}
          queryKey={queryKey}
        />
      </div>
    </div>
  );
};

export default memo(CategoryCard);
