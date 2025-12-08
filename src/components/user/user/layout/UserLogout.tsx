"use client";

import { memo, useCallback } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  UserRouteType,
  useUserLayoutRoutesNavigator,
} from "@/hooks/useUserLayoutRoutesNavigator";

const UserLogout = () => {
  const [{ icon: Icon, label }] = useUserLayoutRoutesNavigator(
    UserRouteType.SIGNOUT
  );

  const handleSignout = useCallback(() => {
    signOut({ redirect: true });
  }, []);

  return (
    <Button
      onClick={handleSignout}
      variant="ghost"
      className="w-full flex items-center justify-start gap-3 p-2 rounded-lg cursor-pointer hover:bg-accent transition-colors group"
    >
      <Icon className="w-4 h-4 text-primary-600 group-hover:text-primary-700 transition-colors" />
      <span className="font-medium text-md text-text-primary-200 group-hover:text-text-primary-100 transition-colors">
        {label}
      </span>
    </Button>
  );
};

export default memo(UserLogout);
