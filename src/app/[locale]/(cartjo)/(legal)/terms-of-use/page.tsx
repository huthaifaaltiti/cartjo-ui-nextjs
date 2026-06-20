import LegalPageRenderer from "@/components/user/legal/LegalPageRenderer";
import { generateLocalizedMetadata } from "@/utils/generateMetadata";


type TermsOfUsePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const TermsOfUsePage = async ({ params }: TermsOfUsePageProps) => {
    const { locale } = await params;

  return (
    <LegalPageRenderer
      locale={locale}
      folderName="terms-of-use"
      fileName="terms-of-use"
      titleKey="routes.termsOfUse.title"
      dateKey="routes.termsOfUse.lastUpdated"
    />
  );
};

export default TermsOfUsePage;

export async function generateMetadata({ params }: TermsOfUsePageProps) {
  const { locale } = await params;

  return generateLocalizedMetadata({
    locale,
    titleAr: "شروط الاستخدام | كارت جو",
    titleEn: "Terms of Use | CartJO",
    descAr:
      "راجع شروط وأحكام استخدام منصة كارت جو وتعرف على حقوقك ومسؤولياتك أثناء التسوق.",
    descEn:
      "Review the terms and conditions of using the CartJO platform and understand your rights and responsibilities while shopping.",
  });
}
