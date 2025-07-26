import { memo } from "react";
import { useLocale, useTranslations } from "next-intl";

import { BaseResponse } from "@/types/service-response.type";
import { SubCategory } from "@/types/subCategory";

import SubCategoryCardActions from "./SubCategoryCardActions";
import EditSubCategoryForm from "./EditSubCategoryForm";
import ImageWithFallback from "@/components/shared/ImageWithFallback";

type SubCategoryCardProps = {
  item: SubCategory;
  deleteSubCategory: (
    accessToken: string,
    userId: string
  ) => Promise<BaseResponse>;
  unDeleteSubCategory: (
    accessToken: string,
    userId: string
  ) => Promise<BaseResponse>;
  accessToken: string;
  switchSubCategoryActiveStatus: (
    token: string,
    lang: string,
    isActive: boolean,
    userId: string
  ) => Promise<BaseResponse>;
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
  const t = useTranslations();
  const isArabic = useLocale() === "ar";

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col">
      <div className="w-auto flex items-end justify-end gap-1 mb-1">
        <span
          className={`px-[5px] py-[0.8px] text-[10px] rounded-full ${
            subCategory?.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {subCategory?.isActive
            ? t("general.items.states.active")
            : t("general.items.states.inactive")}
        </span>

        {subCategory?.isDeleted && (
          <span className="ml-2 px-[5px] py-[0.8px] text-[10px] rounded-full bg-gray-200 text-gray-700">
            {t("general.items.states.deleted")}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 border border-gray-200">
          <ImageWithFallback
            src={subCategory?.media?.url}
            alt={subCategory.name.en}
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />
        </div>

        <h3 className="text-sm font-semibold text-gray-900 capitalize">
          {isArabic ? subCategory?.name.ar : subCategory?.name.en}
        </h3>
      </div>

      <div className="text-xs text-gray-600 mb-4 my-1">
        <p>
          {t("general.others.created")}:{" "}
          {new Date(subCategory?.createdAt).toLocaleDateString("en-US")}
        </p>
        {subCategory?.updatedAt && (
          <p>
            {t("general.others.updated")}:{" "}
            {new Date(subCategory?.updatedAt).toLocaleDateString("en-US")}
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
