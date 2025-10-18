import { memo } from "react";

import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import AuthTabs from "@/components/AuthTabs";
import TopBar from "@/components/TopBar";
import { VerifyEmailContextProvider } from "@/contexts/VerifyEmailContext";

const AuthPage = () => {
  return (
    <VerifyEmailContextProvider>
      <div>
        <TopBar />
        <MaxWidthWrapper className="py-8 flex items-center justify-center">
          <AuthTabs />
        </MaxWidthWrapper>
      </div>
    </VerifyEmailContextProvider>
  );
};

export default memo(AuthPage);
