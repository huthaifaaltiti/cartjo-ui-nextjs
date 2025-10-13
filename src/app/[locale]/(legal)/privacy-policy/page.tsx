import LegalPageRenderer from "@/components/user/legal/LegalPageRenderer";
import { generateLocalizedMetadata } from "@/utils/generateMetadata";


type PrivacyPolicyPageProps = {
  params: {
    locale: string;
  };
};

const PrivacyPolicyPage = ({ params }: PrivacyPolicyPageProps) => {
  return (
    <LegalPageRenderer
      locale={params.locale}
      folderName="policies"
      fileName="privacy-policy"
      titleKey="routes.privacyPolicy.title"
      dateKey="routes.privacyPolicy.lastUpdated"
    />
  );
};

export default PrivacyPolicyPage;

export async function generateMetadata({ params }: PrivacyPolicyPageProps) {
  const { locale } = params;

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
