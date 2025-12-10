import { memo } from "react";
import { Blocks } from "lucide-react";
import { Logo } from "@/types/logo";
import { LogosContextProvider } from "@/contexts/LogosContext";
import SearchLogos from "./SearchLogos";
import ModalCreateButton from "@/components/shared/ModalCreateButton";
import LogosList from "./LogosList";
import CreateLogoForm from "./CreateLogoForm";

type LogosPageProps = {
  initialLogos: Logo[];
  accessToken: string | null;
};

const LogosPage = ({ initialLogos, accessToken }: LogosPageProps) => {
  return (
    <LogosContextProvider accessToken={accessToken}>
      <div className="w-full flex flex-col items-start gap-1 md:flex-row md:items-center md:justify-between md:gap-5 mb-3">
        <SearchLogos />
        <ModalCreateButton
          icon={<Blocks />}
          createTranslationKey="routes.dashboard.routes.logos.createLogo.label"
          ModalContent={<CreateLogoForm />}
        />
      </div>

      <LogosList initialLogos={initialLogos} />
    </LogosContextProvider>
  );
};

export default memo(LogosPage);
