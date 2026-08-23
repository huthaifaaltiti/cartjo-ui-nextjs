import { Locale } from "@/types/locale";
import { ArrowUpRight, Video } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface DashboardSection {
  titleKey: string;
  descKey: string;
  href: string;
  icon: React.ElementType;
  available: boolean;
}

const sections: DashboardSection[] = [
  {
    titleKey: "sections.heroVideos.title",
    descKey: "sections.heroVideos.desc",
    href: "videos",
    icon: Video,
    available: true,
  },
];

const DashboardCreatorsPageContainer = ({ locale }: { locale: Locale }) => {
  const t = useTranslations("routes.dashboard.routes.creators");
  const tg = useTranslations("general");

  return (
    <div className="w-full px-6 py-8 lg:px-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">{t("title")}</h1>
        <p className="mt-1 text-sm text-neutral-500">{t("desc")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;

          const cardContent = (
            <div
              className={`group relative flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6 transition-all ${
                section.available
                  ? "cursor-pointer hover:border-neutral-300 hover:shadow-md"
                  : "opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-700">
                  <Icon className="h-5 w-5" />
                </div>
                {section.available ? (
                  <ArrowUpRight className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-700" />
                ) : (
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500">
                    {tg("others.comingSoon")}
                  </span>
                )}
              </div>

              <h2 className="mt-4 text-base font-semibold text-neutral-900">
                {t(section.titleKey)}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">
                {t(section.descKey)}
              </p>
            </div>
          );

          return section.available ? (
            <Link
              key={section.href}
              href={`/${locale}/dashboard/creators/${section.href}`}
            >
              {cardContent}
            </Link>
          ) : (
            <div key={section.href}>{cardContent}</div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardCreatorsPageContainer;
