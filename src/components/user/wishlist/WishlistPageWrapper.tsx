import { WishlistContextProvider } from "@/contexts/Wishlist.context";
import { memo, ReactNode } from "react";
import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";

const WishlistPageWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <WishlistContextProvider>
      <MaxWidthWrapper className="w-full h-full px-0 md:px-0">
        {children}
      </MaxWidthWrapper>
    </WishlistContextProvider>
  );
};

export default memo(WishlistPageWrapper);
