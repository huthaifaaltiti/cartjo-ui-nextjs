import Footer from "@/components/Footer";
import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import TopBar from "@/components/TopBar";
import CheckoutLayoutHeader from "@/components/user/checkout/CheckoutLayoutHeader";
import { Locale } from "@/types/locale";

export default async function CheckoutPageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const { locale } = await params;

  return (
    <>
      <TopBar />
      <MaxWidthWrapper className="w-full min-h-[70vh]">
        <div className="w-full flex items-center justify-between">
          <CheckoutLayoutHeader />
        </div>
        <div className="w-full">{children}</div>
      </MaxWidthWrapper>
      <Footer locale={locale} />
    </>
  );
}
