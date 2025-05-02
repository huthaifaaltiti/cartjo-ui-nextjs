import { memo } from "react";

import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import Login from "@/components/Login";

const LoginPage: React.FC = () => {
  return (
    <MaxWidthWrapper>
      <Login />
    </MaxWidthWrapper>
  );
};

export default memo(LoginPage);
