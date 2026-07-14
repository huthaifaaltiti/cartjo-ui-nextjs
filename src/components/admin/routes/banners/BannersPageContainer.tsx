import { memo } from "react";
import SearchBanners from "./SearchBanners";
import BannersList from "./BannersList";
import CreateBannerButton from "./CreateBannerButton";

const BannersPageContainer = () => {
  return (
    <div className="w-full">
      <div className="w-full flex flex-col items-start gap-1 md:flex-row md:items-center md:justify-between md:gap-5 mb-3">
        <SearchBanners />
        <CreateBannerButton />
      </div>
      <BannersList />
    </div>
  );
};

export default memo(BannersPageContainer);
