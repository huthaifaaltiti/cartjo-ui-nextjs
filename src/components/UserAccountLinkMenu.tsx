"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, User, UserRoundPen } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGeneralContext } from "@/contexts/General.context";
import { LogoutBtn } from "./shared/LogoutBrn";

const UserAccountLinkMenu = () => {
  const router = useRouter();
  const t = useTranslations();
  const { dir } = useGeneralContext();

  return (
    <DropdownMenu dir={dir}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-1">
          <User className="w-4 h-4" />
          {t("routes.home.components.UserAccountLinkMenu.account")}
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/user")}
        >
          <UserRoundPen className="w-4 h-4" />
          {t("routes.home.components.UserAccountLinkMenu.myAccount")}
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">
          <LogoutBtn />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default memo(UserAccountLinkMenu);
