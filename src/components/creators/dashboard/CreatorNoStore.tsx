import Link from "next/link";
import { Store, Plus, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

const CreatorNoStore = () => {
  const locale = useLocale();
  const t = useTranslations(
    "routes.creators.routes.dashboard.routes.store.noStore",
  );

  return (
    <div className="flex min-h-[460px] flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed border-gray-200 bg-white p-8 text-center shadow-2xs">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 shadow-2xs">
        <Store className="h-8 w-8" />
      </div>

      <div className="max-w-md space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          Onboarding
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {t("title")}
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed">{t("desc")}</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href={`/${locale}/creators/dashboard/store/create`}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
        >
          <Plus className="text-grey-500" />
          <span>{t("actions.createStore")}</span>
        </Link>
      </div>
    </div>
  );
};

export default CreatorNoStore;
