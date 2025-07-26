import { memo } from "react";
import { useLocale, useTranslations } from "next-intl";

import { BaseResponse } from "@/types/service-response.type";
import { Category } from "@/types/category";
import { Locale } from "@/types/locale";

import { isArabicLocale } from "@/config/locales.config";

import CategoryCardActions from "./CategoryCardActions";
import EditCategoryForm from "./EditCategoryForm";
import ImageWithFallback from "@/components/shared/ImageWithFallback";

type CategoryCardProps = {
  item: Category;
  deleteCategory: (
    accessToken: string,
    userId: string,
    lang: Locale
  ) => Promise<BaseResponse>;
  unDeleteCategory: (
    accessToken: string,
    userId: string,
    lang: Locale
  ) => Promise<BaseResponse>;
  accessToken: string;
  switchCategoryActiveStatus: (
    token: string,
    lang: string,
    isActive: boolean,
    userId: string
  ) => Promise<BaseResponse>;
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
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col">
      <div className="w-auto flex items-end justify-end gap-1 mb-1">
        <span
          className={`px-[5px] py-[0.8px] text-[10px] rounded-full ${
            category.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {category.isActive
            ? t("general.items.states.active")
            : t("general.items.states.inactive")}
        </span>

        {category.isDeleted && (
          <span className="ml-2 px-[5px] py-[0.8px] text-[10px] rounded-full bg-gray-200 text-gray-700">
            {t("general.items.states.deleted")}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 border border-gray-200">
          <ImageWithFallback
            src={category?.media?.url}
            alt={category.name.en}
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />
        </div>

        <h3 className="text-sm font-semibold text-gray-900 capitalize">
          {isArabic ? category.name.ar : category.name.en}
        </h3>
      </div>

      <div className="text-xs text-gray-600 mb-4 my-1">
        <p>
          {t("general.others.created")}:{" "}
          {new Date(category.createdAt).toLocaleDateString("en-US")}
        </p>
        {category.updatedAt && (
          <p>
            {t("general.others.updated")}:{" "}
            {new Date(category.updatedAt).toLocaleDateString("en-US")}
          </p>
        )}
      </div>

      <div className="mt-auto">
        <CategoryCardActions
          cardItem={category}
          deleteFn={deleteCategory}
          unDeleteFn={unDeleteCategory}
          accessToken={accessToken}
          switchUserActiveStatusFn={switchCategoryActiveStatus}
          queryKey={queryKey}
          showEditButton={true}
          renderEditForm={() => <EditCategoryForm category={category} />}
        />
      </div>
    </div>
  );
};

export default memo(CategoryCard);
