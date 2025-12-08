import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import TopBar from "@/components/TopBar";
import WishlistLayoutHeader from "@/components/user/wishlist/WishlistLayoutHeader";
import WishlistLayoutHeaderActions from "@/components/user/wishlist/WishlistLayoutHeaderActions";
import { WishlistContextProvider } from "@/contexts/Wishlist.context";

export default async function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WishlistContextProvider>
      <TopBar />
      <MaxWidthWrapper className="w-full min-h-[70vh]">
        <div className="w-full flex items-center justify-between gap-5">
          <WishlistLayoutHeader />
          <WishlistLayoutHeaderActions />
        </div>
        <div className="w-full">{children}</div>
      </MaxWidthWrapper>
    </WishlistContextProvider>
  );
}
