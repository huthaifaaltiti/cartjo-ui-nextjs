import { Category } from "@/types/category.type";
import { Locale } from "@/types/locale";
import { Product } from "@/types/product.type";
import capitalizeWords from "@/utils/capitalizeWords";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

interface ProductBreadcrumbProps {
  product: Product;
  pathnameSections: string[];
  locale: Locale;
  categories: Category[];
  isArabic: boolean;
}

export default function ProductBreadcrumb({
  product,
  pathnameSections,
  locale,
  categories,
  isArabic,
}: ProductBreadcrumbProps) {
  const [categorySlug, subCategorySlug] = pathnameSections;

  const category = useMemo(
    () => categories.find((c) => c.slug === categorySlug),
    [categories, categorySlug],
  );

  const subCategory = useMemo(
    () => category?.subCategories?.find((sc) => sc.slug === subCategorySlug),
    [category, subCategorySlug],
  );

  const crumbs = useMemo(() => {
    const items: {
      label: string;
      href?: { pathname: string; query?: Record<string, string> };
    }[] = [];

    if (category) {
      items.push({
        label: isArabic
          ? category.name?.ar
          : capitalizeWords(category.name?.en),
        href: {
          pathname: `/${locale}/${category.slug}`,
          query: { c_id: category._id },
        },
      });
    }

    if (category && subCategory) {
      items.push({
        label: isArabic
          ? subCategory.name?.ar
          : capitalizeWords(subCategory.name?.en),
        href: {
          pathname: `/${locale}/${category.slug}/${subCategory.slug}`,
          query: {
            c_id: category._id,
            sc_id: subCategory._id,
          },
        },
      });
    }

    items.push({
      label: isArabic
        ? product.name?.ar
        : product.name?.en?.charAt(0).toUpperCase() +
          product.name?.en?.slice(1),
    });

    return items.filter((c) => !!c.label);
  }, [category, subCategory, product, locale, isArabic]);

  if (!crumbs.length) return null;

  return (
    <nav className="flex items-center gap-1.5 flex-wrap mb-6">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;

        const content =
          crumb.href && !isLast ? (
            <Link
              href={crumb.href}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              {crumb.label}
            </Link>
          ) : (
            <span
              className={`text-xs ${
                isLast ? "text-gray-900 font-semibold" : "text-gray-400"
              }`}
            >
              {crumb.label}
            </span>
          );

        return (
          <span
            key={`${crumb.label}-${i}`}
            className="flex items-center gap-1.5"
          >
            {content}
            {!isLast &&
              (isArabic ? (
                <ChevronLeft size={12} className="text-gray-300" />
              ) : (
                <ChevronRight size={12} className="text-gray-300" />
              ))}
          </span>
        );
      })}
    </nav>
  );
}
