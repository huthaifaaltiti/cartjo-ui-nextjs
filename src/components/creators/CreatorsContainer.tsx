import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import CreatorsHero from "./CreatorsHero";
import DynamicCreatorsLogo from "./DynamicCreatorsLogo";

export default function CreatorsPageContainer({
  isArabic,
}: {
  isArabic: boolean;
}) {
  const t = useTranslations("routes.creators.header");

  return (
    <div className="w-full">
      {/* Nav */}
      <header className="w-full">
        <div className="mx-auto flex items-center justify-between px-6 py-5">
          <DynamicCreatorsLogo isArabic={isArabic} />

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="px-4 font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white"
            >
              {t("signIn")}
            </Button>

            <Button className="text-sm text-white-50 font-medium bg-primary-400 rounded-full px-4 py-2 hover:bg-primary-300 transition-colors">
              {t("becomeCreator")}
            </Button>
          </div>
        </div>
      </header>

      <CreatorsHero />
    </div>
  );
}
