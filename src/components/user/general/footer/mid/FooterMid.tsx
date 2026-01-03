import { Locale } from "@/types/locale";
import FooterMidContent from "./FooterMidContent";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { REVALIDATION_TAGS } from "@/config/revalidation";
import { Category } from "@/types/category.type";
import { fetcher } from "@/utils/fetcher";

type ActiveCategoriesType = {
  data: Category[];
  dataCount: number;
  isSuccess: boolean;
  message: string;
};

export default async function FooterMid({
  locale,
  isArabic = false,
}: {
  locale: Locale;
  isArabic: boolean;
}) {
  const res = await fetcher<ActiveCategoriesType>(
    API_ENDPOINTS.DASHBOARD.CATEGORIES.ACTIVE,
    {
      next: {
        tags: [REVALIDATION_TAGS.ACTIVE_CATEGORIES],
      },
    }
  );

  const categoriesWithSubs = res.data.filter(
    (c: Category) => c.subCategories?.length
  );

  const showNoData = !categoriesWithSubs.length;
  const showData = categoriesWithSubs.length > 0;

  if (showNoData) return null;

  if (showData) {
    return (
      <FooterMidContent
        locale={locale}
        data={categoriesWithSubs}
        isArabic={isArabic}
      />
    );
  }
}
