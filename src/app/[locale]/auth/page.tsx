import { memo } from "react";

import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import Login from "@/components/Login";

const Auth: React.FC = () => {
  return (
    <MaxWidthWrapper>
      <Login />
    </MaxWidthWrapper>
  );
};

export default memo(Auth);
