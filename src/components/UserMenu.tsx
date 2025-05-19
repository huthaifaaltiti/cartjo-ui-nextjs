"use client";

import { memo } from "react";
import { useSession } from "next-auth/react";

import UserSignInLink from "./UserSignInLink";
import UserAccountLink from "./UserAccountLink";
import UserDashboardLink from "./admin/UserDashboardLink";

const UserMenu = () => {
  const { data: session, status } = useSession();

  const canManage = session?.user?.canManage ?? false;

  console.log("Session:", session);

  if (status === "loading") return <UserSignInLink />;

  if (!session) return <UserSignInLink />;

  return (
    <div className="flex items-center gap-5">
      <UserAccountLink />

      {canManage && <UserDashboardLink />}
    </div>
  );
};

export default memo(UserMenu);
