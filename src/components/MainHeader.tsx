import { memo } from "react";

import MaxWidthWrapper from "./shared/MaxWidthWrapper";
import UserActions from "./UserActions";
import DynamicLogo from "./shared/DynamicLogo";
import MainSearchBar from "./MainSearchBar";

const MAinHeader = () => {
  return (
    <div className="w-full mt-3">
      <MaxWidthWrapper>
        <div className="w-full flex items-center justify-between gap-5">
          <div className="w-1/4">
            <DynamicLogo />
          </div>
          <div className="w-2/4">
            <MainSearchBar />
          </div>
          <div className="w-1/4">
            <UserActions />
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default memo(MAinHeader);
