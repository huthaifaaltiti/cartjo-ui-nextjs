import { memo } from "react";
import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import AuthTabs from "@/components/AuthTabs";

const AuthPage = () => {
  return (
    <MaxWidthWrapper className="py-8 flex items-center justify-center">
      <AuthTabs />
    </MaxWidthWrapper>
  );
};

export default memo(AuthPage);
