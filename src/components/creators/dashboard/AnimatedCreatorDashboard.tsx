"use client";

import { useTranslations, useLocale } from "next-intl";
import { memo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  Sparkles,
  Store,
  Video,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { isArabicLocale } from "@/config/locales.config";
import AnimationStyles from "@/components/admin/shared/animated/AnimationStyles";
import ParticleField from "@/components/admin/shared/animated/ParticleField";
import AmbientGlow from "@/components/admin/shared/animated/AmbientGlow";
import OrbitIconMark from "@/components/admin/shared/animated/OrbitIconMark";
import TypewriterGreeting from "@/components/admin/shared/animated/TypewriterGreeting";
import QuickActionCard from "./QuickActionCard";
import FeatureBadges from "./FeatureBadges";

const AnimatedCreatorDashboard = () => {
  const t = useTranslations(
    "routes.creators.routes.dashboard.components.AnimatedCreatorDashboard",
  );
  const tg = useTranslations("general");
  const locale = useLocale();
  const isAr = isArabicLocale(locale);

  const { session } = useSelector((state: RootState) => state.authentication);
  const firstName = session?.firstName || tg("creator.label");

  const hour = new Date().getHours();
  const greetingKey =
    hour < 12 ? "goodMorning" : hour < 18 ? "goodAfternoon" : "goodEvening";
  const fullText = `${t(greetingKey)}, ${firstName}.`;

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const badges = [
    { label: t("badges.store"), color: "#8b5cf6", bg: "#f5f3ff" },
    { label: t("badges.videos"), color: "#3b82f6", bg: "#eff6ff" },
    { label: t("badges.earnings"), color: "#10b981", bg: "#ecfdf5" },
    { label: t("badges.analytics"), color: "#ec4899", bg: "#fdf2f8" },
    { label: t("badges.payouts"), color: "#f59e0b", bg: "#fffbeb" },
  ];

  return (
    <>
      <AnimationStyles />

      <div className="relative w-full h-full min-h-[calc(100vh-2rem)] md:min-h-0 md:h-full flex flex-col items-center justify-center overflow-hidden px-4 py-2 sm:px-6">
        <ParticleField />
        <AmbientGlow />

        <OrbitIconMark icon={Sparkles} />

        <TypewriterGreeting
          text={fullText}
          subheading={t("welcome")}
          subtitle={t("subtitle")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl z-10 shrink-0 mb-3 sm:mb-4">
          <QuickActionCard
            href={`/${locale}/creators/dashboard/store`}
            icon={Store}
            title={t("cards.storeTitle")}
            description={t("cards.storeDesc")}
            ctaLabel={t("cards.storeBtn")}
            ctaIcon={
              <ArrowIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            }
            accentColor="purple"
          />

          <QuickActionCard
            href={`/${locale}/stores`}
            icon={ShoppingBag}
            title={t("cards.exploreTitle")}
            description={t("cards.exploreDesc")}
            ctaLabel={t("cards.exploreBtn")}
            ctaIcon={
              <ArrowIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            }
            accentColor="pink"
          />

          <QuickActionCard
            icon={Video}
            title={t("cards.videosTitle")}
            description={t("cards.videosDesc")}
            ctaLabel={t("cards.videosBtn")}
            accentColor="blue"
            trailing={
              <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                Live
              </span>
            }
          />
        </div>

        <FeatureBadges badges={badges} />
      </div>
    </>
  );
};

export default memo(AnimatedCreatorDashboard);
