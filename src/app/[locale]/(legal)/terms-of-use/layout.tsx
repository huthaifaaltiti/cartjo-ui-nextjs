import Footer from "@/components/Footer";
import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import TopBar from "@/components/TopBar";
import { Locale } from "@/types/locale";

export default async function TermsOfUsePageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params:  Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <>
      <TopBar />
      <MaxWidthWrapper className="w-full min-h-[70vh]">
        <div className="w-full">{children}</div>
      </MaxWidthWrapper>
      <Footer locale={locale as Locale} />
    </>
  );
}
