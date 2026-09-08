import { memo } from "react";
import MaxWidthWrapper from "./shared/MaxWidthWrapper";
import UserActions from "./UserActions";
import DynamicLogo from "./shared/DynamicLogo";
import MainSearchBar from "./MainSearchBar";
import { CartJOSession } from "@/types/cartjoSession.type";
import { TokenSession } from "@/types/tokenSession.type";

interface MainHeaderProps {
  initialSession?: CartJOSession | TokenSession | null;
}

const MainHeader = ({ initialSession }: MainHeaderProps) => {
  return (
    <div className="w-full py-4 md:py-6">
      <MaxWidthWrapper>
        <div className="flex w-full flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center justify-center md:justify-start w-full md:w-auto">
            <DynamicLogo />
          </div>

          <div className="w-full max-w-xl md:flex-1">
            <MainSearchBar />
          </div>

          <div className="flex items-center justify-center gap-3 w-full md:w-auto md:justify-center">
            <UserActions initialSession={initialSession} />
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default memo(MainHeader);
