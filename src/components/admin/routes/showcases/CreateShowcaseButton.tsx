"use memo";

import { memo } from "react";
import { Blocks } from "lucide-react";
import ModalCreateButton from "@/components/shared/ModalCreateButton";
import CreateShowcaseForm from "./CreateShowcaseForm";
import { usePermission } from "@/hooks/usePermission";
import { Permission } from "@/enums/permission.enum";

const CreateShowcaseButton = () => {
  const { canCreateShowcase } = usePermission({
    canCreateShowcase: Permission.SHOWCASES_CREATE,
  });

  return (
    <div>
      {canCreateShowcase && (
        <ModalCreateButton
          icon={<Blocks />}
          createTranslationKey="routes.dashboard.routes.showcases.createShowcase.label"
          ModalContent={<CreateShowcaseForm />}
        />
      )}
    </div>
  );
};

export default memo(CreateShowcaseButton);
