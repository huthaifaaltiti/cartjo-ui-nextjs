import { useCallback } from "react";
import { Category } from "@/types/category.type";
import Link from "next/link";
import { SubCategory } from "@/types/subCategory";
import { Locale } from "@/types/locale";

interface Props {
  data: Category[];
  isArabic: boolean;
  locale: Locale | string;
}

const FooterMidContent = ({ data, isArabic, locale }: Props) => {
  const getUrl = useCallback(
    (
      item: Category | SubCategory,
      type: "category" | "subCategory",
      parentCategory?: Category
    ) => {
      const slugify = (text?: string) =>
        text?.toLowerCase().trim().replace(/\s+/g, "-") ?? "";

      const categorySlug =
        type === "category"
          ? (item as Category).slug || slugify((item as Category).name?.en)
          : parentCategory?.slug || slugify(parentCategory?.name?.en);

      const subCategorySlug =
        type === "subCategory"
          ? (item as SubCategory).slug ||
            slugify((item as SubCategory).name?.en)
          : null;

      const pathname = subCategorySlug
        ? `/${locale}/${categorySlug}/${subCategorySlug}`
        : `/${locale}/${categorySlug}`;

      const query =
        type === "category"
          ? { c_id: (item as Category)._id }
          : {
              c_id: parentCategory?._id,
              sc_id: (item as SubCategory)._id,
            };

      return { pathname, query };
    },
    [data, locale]
  );

  return (
    <div className="container mx-auto grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 py-10 px-4 sm:px-6 lg:px-8">
      {data.map((item: Category) => (
        <div key={item._id}>
          <h3 className="font-bold capitalize text-sm sm:text-md lg:text-lg text-text-primary-200 mb-3">
            <Link href={getUrl(item, "category")}>
              {isArabic ? item.name.ar : item.name.en}
            </Link>
          </h3>

          <ul className="space-y-1">
            {item.subCategories.map((sub) => (
              <li key={sub._id}>
                <Link
                  href={getUrl(sub, "subCategory", item)}
                  className="text-xs capitalize sm:text-sm lg:text-md text-text-primary-200 hover:text-primary-500 transition-colors"
                >
                  {isArabic ? sub.name.ar : sub.name.en}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default FooterMidContent;
