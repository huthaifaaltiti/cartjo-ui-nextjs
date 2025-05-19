import { memo } from "react";
import MaxWidthWrapper from "./shared/MaxWidthWrapper";
import UserActions from "./UserActions";

const MAinHeader = () => {
  return (
    <div className="w-full mt-3">
      <MaxWidthWrapper>
        <div className="w-full flex items-center justify-between gap-5">
          <div className="w-1/3">Logo + Lang Selector</div>
          <div className="w-2/3">Search bar</div>
          <div className="w-1/3">
            <UserActions />
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default memo(MAinHeader);
