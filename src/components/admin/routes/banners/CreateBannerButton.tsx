"use client";

import { memo } from "react";
import ModalCreateButton from "@/components/shared/ModalCreateButton";
import { Blocks } from "lucide-react";
import CreateBannerForm from "./CreateBannerForm";
import { usePermission } from "@/hooks/usePermission";
import { Permission } from "@/enums/permission.enum";

const CreateBannerButton = () => {
  const { canCreateBanner } = usePermission({
    canCreateBanner: Permission.BANNERS_CREATE,
  });

  return (
    <div>
      {canCreateBanner && (
        <ModalCreateButton
          icon={<Blocks />}
          createTranslationKey="routes.dashboard.routes.banners.createBanner.label"
          ModalContent={<CreateBannerForm />}
        />
      )}
    </div>
  );
};

export default memo(CreateBannerButton);
