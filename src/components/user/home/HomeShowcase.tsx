import { memo } from "react";

import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import { ShowcasesContextProvider } from "@/contexts/Showcase.context";
import HomeShowcaseContent from "./HomeShowcaseContent";
import { getAccessTokenFromServerSession } from "@/lib/serverSession";

const HomeShowcase = async () => {
  const token = await getAccessTokenFromServerSession();

  return (
    <div className="w-full min-h-screen h-full bg-gradient-to-b from-gray-100 to-white-50">
      <MaxWidthWrapper className="w-full py-14">
        <ShowcasesContextProvider accessToken={token || ""}>
          <HomeShowcaseContent />
        </ShowcasesContextProvider>
      </MaxWidthWrapper>
    </div>
  );
};

export default memo(HomeShowcase);
