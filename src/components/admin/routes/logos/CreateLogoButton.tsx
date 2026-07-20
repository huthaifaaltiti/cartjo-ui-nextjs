"use client";

import { memo } from "react";
import { Blocks } from "lucide-react";
import ModalCreateButton from "@/components/shared/ModalCreateButton";
import CreateLogoForm from "./CreateLogoForm";
import { usePermission } from "@/hooks/usePermission";
import { Permission } from "@/enums/permission.enum";

const CreateLogoButton = () => {
  const { canCreateLogo } = usePermission({
    canCreateLogo: Permission.LOGOS_CREATE,
  });

  return (
    <div>
      {canCreateLogo && (
        <ModalCreateButton
          icon={<Blocks />}
          createTranslationKey="routes.dashboard.routes.logos.createLogo.label"
          ModalContent={<CreateLogoForm />}
        />
      )}
    </div>
  );
};

export default memo(CreateLogoButton);
