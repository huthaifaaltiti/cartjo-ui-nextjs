import { memo } from "react";
import { Blocks } from "lucide-react";
import { Banner } from "@/types/banner.type";
import { BannersContextProvider } from "@/contexts/Banners.context";
import SearchBanners from "./SearchBanners";
import ModalCreateButton from "@/components/shared/ModalCreateButton";
import BannersList from "./BannersList";
import CreateBannerForm from "./CreateBannerForm";

type BannersPageProps = {
  data: Banner[];
  token: string | null;
};

const BannersPage = ({ data, token }: BannersPageProps) => {
  return (
    <BannersContextProvider token={token}>
      <div className="w-full flex flex-col items-start gap-1 md:flex-row md:items-center md:justify-between md:gap-5 mb-3">
        <SearchBanners />
        <ModalCreateButton
          icon={<Blocks />}
          createTranslationKey="routes.dashboard.routes.banners.createBanner.label"
          ModalContent={<CreateBannerForm />}
        />
      </div>
      <BannersList initialBanners={data} />
    </BannersContextProvider>
  );
};

export default memo(BannersPage);
