import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import { Locale } from "@/types/locale";

export default async function CreatorsVerifyEmailPageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale | string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <TopBar />
      <div className="w-full min-h-screen">{children}</div>
      <Footer locale={locale as Locale} />
    </>
  );
}
