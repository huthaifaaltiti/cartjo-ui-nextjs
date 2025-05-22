"use client";

import { memo } from "react";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

import UserSignInLink from "./UserSignInLink";
import UserDashboardLink from "./admin/UserDashboardLink";
import UserAccountLinkMenu from "./UserAccountLinkMenu";

type ExtendedSession = Session & {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    canManage?: boolean;
  };
};

const UserMenu = () => {
  const { data: sessionData, status } = useSession();

  const session = sessionData as ExtendedSession | null;

  const canManage = session?.user?.canManage ?? false;

  if (status === "loading") return <UserSignInLink />;

  if (!session) return <UserSignInLink />;

  return (
    <div className="flex items-center gap-1">
      {canManage && <UserDashboardLink />}
      <UserAccountLinkMenu />
    </div>
  );
};

export default memo(UserMenu);
