"use client";

import { memo } from "react";
import { BlocksIcon } from "lucide-react";
import ModalCreateButton from "@/components/shared/ModalCreateButton";
import CreateProductForm from "./CreateProductForm";
import { usePermission } from "@/hooks/usePermission";
import { Permission } from "@/enums/permission.enum";

const ProductsCreateButton = () => {
  const { canCreateProduct } = usePermission({
    canCreateProduct: Permission.PRODUCTS_CREATE,
  });

  return (
    <div>
      {canCreateProduct && (
        <ModalCreateButton
          icon={<BlocksIcon />}
          createTranslationKey="routes.dashboard.routes.products.createProduct.label"
          ModalContent={<CreateProductForm />}
        />
      )}
    </div>
  );
};

export default memo(ProductsCreateButton);
