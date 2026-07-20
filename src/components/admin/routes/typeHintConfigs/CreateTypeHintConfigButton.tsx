"use client";

import { memo } from "react";
import ModalCreateButton from "@/components/shared/ModalCreateButton";
import { Blocks } from "lucide-react";
import CreateTypeHintConfigForm from "./CreateTypeHintConfigForm";
import { usePermission } from "@/hooks/usePermission";
import { Permission } from "@/enums/permission.enum";

const CreateTypeHintConfigButton = () => {
  const { canCreateTypeHintConfig } = usePermission({
    canCreateTypeHintConfig: Permission.TYPE_HINT_CONFIGS_CREATE,
  });

  return (
    <div>
      {canCreateTypeHintConfig && (
        <ModalCreateButton
          icon={<Blocks />}
          createTranslationKey="routes.dashboard.routes.typeHintConfigs.createTypeHintConfig.label"
          ModalContent={<CreateTypeHintConfigForm />}
        />
      )}
    </div>
  );
};

export default memo(CreateTypeHintConfigButton);
