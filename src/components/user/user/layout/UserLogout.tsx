"use client";

import { memo } from "react";
import { Power } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

const UserLogout = () => {
  const t = useTranslations();

  const handleSignout = () => {
    signOut({ redirect: true });
  };

  return (
    <Button
      onClick={handleSignout}
      className="w-full shadow-none flex items-center justify-start gap-3 p-2 rounded-lg cursor-pointer hover:bg-[#f7e0df] transition-all group"
    >
      <Power className="w-4 h-4 text-primary-600 group-hover:text-primary-700" />
      <span className="font-normal text-md text-text-primary-200">
        {t("routes.user.layout.components.UserLogout.label")}
      </span>
    </Button>
  );
};

export default memo(UserLogout);
