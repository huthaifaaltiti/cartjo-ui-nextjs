import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import TopBar from "@/components/TopBar";
import WishlistLayoutHeader from "@/components/user/wishlist/WishlistLayoutHeader";

export default async function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopBar />
      <MaxWidthWrapper className="w-full min-h-screen">
        <WishlistLayoutHeader />
        <div className="w-full">{children}</div>
      </MaxWidthWrapper>
    </>
  );
}
