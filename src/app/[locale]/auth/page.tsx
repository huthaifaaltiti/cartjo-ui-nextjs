import { memo } from "react";

import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import AuthTabs from "@/components/AuthTabs";
import TopBar from "@/components/TopBar";

const AuthPage = () => {
  return (
    <div>
      <TopBar />
      <MaxWidthWrapper className="py-8 flex items-center justify-center">
        <AuthTabs />
      </MaxWidthWrapper>
    </div>
  );
};

export default memo(AuthPage);
