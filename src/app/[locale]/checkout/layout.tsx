import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import TopBar from "@/components/TopBar";
import CheckoutLayoutHeader from "@/components/user/checkout/CheckoutLayoutHeader";

export default async function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopBar />
      <MaxWidthWrapper className="w-full min-h-[70vh]">
        <div className="w-full flex items-center justify-between">
          <CheckoutLayoutHeader />
        </div>
        <div className="w-full">{children}</div>
      </MaxWidthWrapper>
    </>
  );
}
