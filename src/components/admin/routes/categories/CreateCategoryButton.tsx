"use client";

import { memo } from "react";
import ModalCreateButton from "@/components/shared/ModalCreateButton";
import { Blocks } from "lucide-react";
import { usePermission } from "@/hooks/usePermission";
import { Permission } from "@/enums/permission.enum";
import CreateCategoryForm from "./CreateCategoryForm";

const CreateCategoryButton = () => {
  const { canCreateCategory } = usePermission({
    canCreateCategory: Permission.CATEGORIES_CREATE,
  });

  return (
    <div>
      {canCreateCategory && (
        <ModalCreateButton
          icon={<Blocks />}
          createTranslationKey="routes.dashboard.routes.categories.createCategory.label"
          ModalContent={<CreateCategoryForm />}
        />
      )}
    </div>
  );
};

export default memo(CreateCategoryButton);
