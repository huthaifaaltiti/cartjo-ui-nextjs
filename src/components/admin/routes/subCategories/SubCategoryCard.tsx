import { memo } from "react";
import Image from "next/image";

import { DeletingResponse, SwitchActiveStatusResponse } from "@/types/common";

import SubCategoryCardActions from "./SubCategoryCardActions";
import EditSubCategoryForm from "./EditSubCategoryForm";
import { SubCategory } from "@/types/subCategory";

type SubCategoryCardProps = {
  item: SubCategory;
  deleteSubCategory: (
    accessToken: string,
    userId: string
  ) => Promise<DeletingResponse>;
  unDeleteSubCategory: (
    accessToken: string,
    userId: string
  ) => Promise<DeletingResponse>;
  accessToken: string;
  switchSubCategoryActiveStatus: (
    token: string,
    lang: string,
    isActive: boolean,
    userId: string
  ) => Promise<SwitchActiveStatusResponse>;
  queryKey: string;
};

const SubCategoryCard = ({
  item: subCategory,
  deleteSubCategory,
  unDeleteSubCategory,
  accessToken,
  switchSubCategoryActiveStatus,
  queryKey,
}: SubCategoryCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 border border-gray-200">
            <Image
              src={subCategory.image}
              alt={subCategory.name.en}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 capitalize">
              {subCategory.name.ar}
            </h3>
            <p className="text-xs text-gray-600">{subCategory.name.en}</p>
          </div>
        </div>

        <span className="w-auto flex items-center gap-1">
          <span
            className={`px-[5px] py-[0.8px] text-[10px] rounded-full ${
              subCategory.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {subCategory.isActive ? "Active" : "Inactive"}
          </span>

          {subCategory.isDeleted && (
            <span className="ml-2 px-[5px] py-[0.8px] text-[10px] rounded-full bg-gray-200 text-gray-700">
              Deleted
            </span>
          )}
        </span>
      </div>

      <div className="text-xs text-gray-600 mb-4 space-y-1">
        <p>
          Created: {new Date(subCategory.createdAt).toLocaleDateString("en-US")}
        </p>
        {subCategory.updatedAt && (
          <p>
            Updated:{" "}
            {new Date(subCategory.updatedAt).toLocaleDateString("en-US")}
          </p>
        )}
      </div>

      <div className="mt-auto">
        <SubCategoryCardActions
          cardItem={subCategory}
          deleteFn={deleteSubCategory}
          unDeleteFn={unDeleteSubCategory}
          accessToken={accessToken}
          switchUserActiveStatusFn={switchSubCategoryActiveStatus}
          queryKey={queryKey}
          showEditButton={true}
          renderEditForm={() => (
            <EditSubCategoryForm subCategory={subCategory} />
          )}
        />
      </div>
    </div>
  );
};

export default memo(SubCategoryCard);
