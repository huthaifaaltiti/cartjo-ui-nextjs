"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ShieldPlus } from "lucide-react";

import { Button } from "@/components/ui/button";

const CreateAdminUserBtn = () => {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="w-full my-2 flex items-end justify-end">
      <Button
        className="w-auto min-h-3 bg-primary-500 hover:bg-primary-600 text-white-50 transition-all"
        onClick={() => router.push("admin-users/create")}
      >
        <ShieldPlus />
        {t(
          "routes.dashboard.routes.users.routes.adminUsers.components.CreateAdminUser.createAdmin"
        )}
      </Button>
    </div>
  );
};

export default memo(CreateAdminUserBtn);
