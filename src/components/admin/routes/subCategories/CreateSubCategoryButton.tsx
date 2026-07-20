"use client";

import { memo } from "react";
import ModalCreateButton from "@/components/shared/ModalCreateButton";
import { BlocksIcon } from "lucide-react";
import { usePermission } from "@/hooks/usePermission";
import { Permission } from "@/enums/permission.enum";
import CreateSubCategoryForm from "./CreateSubCategoryForm";

const CreateSubCategoryButton = () => {
  const { canCreateSubCategory } = usePermission({
    canCreateSubCategory: Permission.SUB_CATEGORIES_CREATE,
  });

  return (
    <div>
      {canCreateSubCategory && (
        <ModalCreateButton
          icon={<BlocksIcon />}
          createTranslationKey="routes.dashboard.routes.subCategories.createSubCategory.label"
          ModalContent={<CreateSubCategoryForm />}
        />
      )}
    </div>
  );
};

export default memo(CreateSubCategoryButton);
