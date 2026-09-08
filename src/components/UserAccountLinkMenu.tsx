"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  User,
  UserRoundPen,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useGeneralContext } from "@/contexts/General.context";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { usePermission } from "@/hooks/usePermission";
import { Permission } from "@/enums/permission.enum";
import {
  isCreatorClientSide,
  isAdminClientSide,
} from "@/utils/session-access.utils";
import { LogoutBtn } from "./shared/LogoutBtn";

const UserAccountLinkMenu = () => {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const { dir } = useGeneralContext();

  const { session } = useSelector((state: RootState) => state.authentication);

  const { canAccessDashboard, canAccessCreatorDashboard } = usePermission({
    canAccessDashboard: Permission.DASHBOARD_ACCESS,
    canAccessCreatorDashboard: Permission.CREATORS_DASHBOARD_ACCESS,
  });

  const isCreator =
    (isCreatorClientSide(session) ?? false) && canAccessCreatorDashboard;
  const isAdmin = (isAdminClientSide(session) ?? false) && canAccessDashboard;

  return (
    <DropdownMenu dir={dir}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-1">
          <User className="w-4 h-4" />
          {t("routes.home.components.UserAccountLinkMenu.account")}
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push(`/${locale}/user`)}
        >
          <UserRoundPen className="w-4 h-4" />
          {t("routes.home.components.UserAccountLinkMenu.myAccount")}
        </DropdownMenuItem>

        {isCreator && (
          <DropdownMenuItem
            className="cursor-pointer text-purple-700 focus:text-purple-800 focus:bg-purple-50"
            onClick={() => router.push(`/${locale}/creators/dashboard`)}
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            {t("routes.home.components.UserAccountLinkMenu.creatorDashboard") ||
              "Creator Studio"}
          </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem
            className="cursor-pointer text-blue-700 focus:text-blue-800 focus:bg-blue-50"
            onClick={() => router.push(`/${locale}/dashboard`)}
          >
            <LayoutDashboard className="w-4 h-4 text-blue-600" />
            {t("routes.home.components.UserDashboardLink.dashboard") ||
              "Admin Dashboard"}
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer">
          <LogoutBtn />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default memo(UserAccountLinkMenu);
