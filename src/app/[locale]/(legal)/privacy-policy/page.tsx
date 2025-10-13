import LegalPageRenderer from "@/components/user/legal/LegalPageRenderer";

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
      titleKey="routes.privacyPolicy.components.PrivacyPolicyHeader.title"
      dateKey="routes.privacyPolicy.components.PrivacyPolicyHeader.lastUpdated"
    />
  );
};

export default PrivacyPolicyPage;

export const metadata = {
  title: "Privacy Policy | CartJO",
  description:
    "Learn how CartJO protects your personal data and privacy while using our e-commerce platform.",
};
