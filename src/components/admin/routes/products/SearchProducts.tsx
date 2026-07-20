"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import SearchBar from "@/components/shared/SearchBar";
import { useProducts } from "@/contexts/Products.context";
import { usePermission } from "@/hooks/usePermission";
import { Permission } from "@/enums/permission.enum";

const SearchProducts = () => {
  const { searchQuery, setSearchQuery } = useProducts();
  const t = useTranslations();

  const { canReadProduct } = usePermission({
    canReadProduct: Permission.PRODUCTS_READ,
  });

  return (
    <div className="w-full">
      <SearchBar
        placeholder={t(
          "routes.dashboard.routes.products.components.SearchBar.placeholder",
        )}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        disabled={!canReadProduct}
      />
    </div>
  );
};

export default memo(SearchProducts);
