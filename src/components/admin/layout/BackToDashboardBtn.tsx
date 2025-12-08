"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

const BackToDashboardBtn = () => {
  const router = useRouter();
  const t = useTranslations();

  return (
    <Button
      className="bg-primary-800 hover:bg-primary-700 transition-all text-xs text-white-50 my-1"
      onClick={() => router.push("/dashboard")}
    >
      <LayoutDashboard />
      {t("routes.dashboard.components.BackToDashboardBtn.label")}
    </Button>
  );
};

export default memo(BackToDashboardBtn);
