import { memo } from "react";

import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import { ShowcasesContextProvider } from "@/contexts/Showcase.context";
import HomeShowcaseContent from "./HomeShowcaseContent";
import { getAccessTokenFromServerSession } from "@/lib/serverSession";
import { LoggedUserWishlistProvider } from "@/contexts/LoggedUserWishList.context";

const HomeShowcase = async () => {
  const token = await getAccessTokenFromServerSession();

  return (
    <div className="w-full h-auto bg-gradient-to-b from-gray-100 to-white-50">
      <MaxWidthWrapper className="w-full py-8">
        <ShowcasesContextProvider accessToken={token}>
          <LoggedUserWishlistProvider>
            <HomeShowcaseContent />
          </LoggedUserWishlistProvider>
        </ShowcasesContextProvider>
      </MaxWidthWrapper>
    </div>
  );
};

export default memo(HomeShowcase);
