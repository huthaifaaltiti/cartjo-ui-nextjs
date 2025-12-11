import LegalPageRenderer from "@/components/user/legal/LegalPageRenderer";
import { generateLocalizedMetadata } from "@/utils/generateMetadata";

type PrivacyPolicyPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const PrivacyPolicyPage = async ({ params }: PrivacyPolicyPageProps) => {
  const { locale } = await params;

  return (
    <LegalPageRenderer
      locale={locale}
      folderName="policies"
      fileName="privacy-policy"
      titleKey="routes.privacyPolicy.title"
      dateKey="routes.privacyPolicy.lastUpdated"
    />
  );
};

export default PrivacyPolicyPage;

export async function generateMetadata({ params }: PrivacyPolicyPageProps) {
  const { locale } = await params;

  return generateLocalizedMetadata({
    locale,
    titleAr: "سياسة الخصوصية | كارت جو",
    titleEn: "Privacy Policy | CartJO",
    descAr:
      "تعرف على كيفية حماية كارت جو لبياناتك الشخصية وضمان خصوصيتك أثناء استخدام منصتنا.",
    descEn:
      "Learn how CartJO protects your personal data and ensures your privacy while using our platform.",
  });
}