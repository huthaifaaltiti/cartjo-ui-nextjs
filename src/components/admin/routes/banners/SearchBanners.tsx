"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import SearchBar from "@/components/shared/SearchBar";
import { setBannersSearchQuery } from "@/redux/slices/banners";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { usePermission } from "@/hooks/usePermission";
import { Permission } from "@/enums/permission.enum";

const SearchBanners = () => {
  const t = useTranslations();

  const dispatch = useDispatch<AppDispatch>();
  const { searchQuery } = useSelector((state: RootState) => state.banners);

  const { canReadBanner } = usePermission({
    canReadBanner: Permission.BANNERS_READ,
  });

  return (
    <div className="w-full px-2 md:px-0">
      <SearchBar
        placeholder={t(
          "routes.dashboard.routes.banners.components.SearchBar.placeholder",
        )}
        searchQuery={searchQuery}
        setSearchQuery={(v) => dispatch(setBannersSearchQuery(v))}
        disabled={!canReadBanner}
      />
    </div>
  );
};

export default memo(SearchBanners);
