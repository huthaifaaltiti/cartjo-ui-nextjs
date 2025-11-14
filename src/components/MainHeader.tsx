import { memo } from "react";
import MaxWidthWrapper from "./shared/MaxWidthWrapper";
import UserActions from "./UserActions";
import DynamicLogo from "./shared/DynamicLogo";
import MainSearchBar from "./MainSearchBar";
import DeliverLocation from "./shared/DeliverLocation";

const MAinHeader = () => {
  return (
    <div className="w-full py-6">
      <MaxWidthWrapper>
        <div className="w-full flex items-center justify-between gap-5">
          <div className="w-1/4 flex items-center gap-1">
            <DynamicLogo />
            <DeliverLocation />
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
