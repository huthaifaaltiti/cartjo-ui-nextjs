import { memo } from "react";
import MaxWidthWrapper from "./shared/MaxWidthWrapper";
import UserActions from "./UserActions";
import DynamicLogo from "./shared/DynamicLogo";
import MainSearchBar from "./MainSearchBar";

const MainHeader = () => {
  return (
    <div className="w-full py-4 md:py-6">
      <MaxWidthWrapper>
        <div className="flex w-full flex-col items-center gap-4 md:flex-row md:justify-between">
          {/* Logo */}
          <div className="flex items-center justify-center md:justify-start w-full md:w-auto">
            <DynamicLogo />
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-xl md:flex-1">
            <MainSearchBar />
          </div>

          {/* User Actions */}
          <div className="flex items-center justify-center gap-3 w-full md:w-auto md:justify-center">
            <UserActions />
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default memo(MainHeader);
