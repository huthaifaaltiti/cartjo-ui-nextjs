import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import { Locale } from "@/types/locale";

export default async function SupportPageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params:  Promise<{ locale: Locale | string }>;
}) {
  const { locale } = await params;
  
  return (
    <>
      <TopBar />
      <div className="w-full">{children}</div>
      <Footer locale={locale as Locale} />
    </>
  );
}
