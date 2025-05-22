"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, LogOutIcon, User, UserRoundPen } from "lucide-react";
import { useTranslations } from "next-intl";

const UserAccountLinkMenu = () => {
  const router = useRouter();
  const t = useTranslations();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-1">
          <User className="w-4 h-4" />
          {t("routes.home.components.UserAccountLinkMenu.account")}
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => router.push("/account")}>
          <UserRoundPen className="w-4 h-4" />
          {t("routes.home.components.UserAccountLinkMenu.myAccount")}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon className="w-4 h-4" />
          {t("routes.home.components.UserAccountLinkMenu.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default memo(UserAccountLinkMenu);
