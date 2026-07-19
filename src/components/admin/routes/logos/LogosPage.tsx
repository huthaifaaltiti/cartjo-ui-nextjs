import { memo } from "react";
import { LogosContextProvider } from "@/contexts/LogosContext";
import SearchLogos from "./SearchLogos";
import LogosList from "./LogosList";
import CreateLogoButton from "./CreateLogoButton";

const LogosPage = () => {
  return (
    <LogosContextProvider>
      <div className="w-full flex flex-col items-start gap-1 md:flex-row md:items-center md:justify-between md:gap-5 mb-3">
        <SearchLogos />
        <CreateLogoButton />
      </div>

      <LogosList />
    </LogosContextProvider>
  );
};

export default memo(LogosPage);
