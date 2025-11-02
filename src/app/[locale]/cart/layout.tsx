import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import TopBar from "@/components/TopBar";
import CartLayoutHeader from "@/components/user/cart/CartLayoutHeader";
import CartLayoutHeaderActions from "@/components/user/cart/CartLayoutHeaderActions";
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
        <div className="w-full flex items-center justify-between">
          <CartLayoutHeader />
          <CartLayoutHeaderActions />
        </div>
        <div className="w-full">{children}</div>
      </MaxWidthWrapper>
    </WishlistContextProvider>
  );
}
