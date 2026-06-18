import { memo } from "react";
import SearchBanners from "./SearchBanners";
import ModalCreateButton from "@/components/shared/ModalCreateButton";
import { Blocks } from "lucide-react";
import CreateBannerForm from "./CreateBannerForm";
import BannersList from "./BannersList";

const BannersPageContainer = () => {
  return (
    <div className="w-full">
      <div className="w-full flex flex-col items-start gap-1 md:flex-row md:items-center md:justify-between md:gap-5 mb-3">
        <SearchBanners />
        <ModalCreateButton
          icon={<Blocks />}
          createTranslationKey="routes.dashboard.routes.banners.createBanner.label"
          ModalContent={<CreateBannerForm />}
        />
      </div>
      <BannersList />
    </div>
  );
};

export default memo(BannersPageContainer);
