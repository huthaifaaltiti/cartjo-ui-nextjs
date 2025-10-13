import LegalPageRenderer from "@/components/user/legal/LegalPageRenderer";

type TermsOfUsePageProps = {
  params: {
    locale: string;
  };
};

const TermsOfUsePage = ({ params }: TermsOfUsePageProps) => {
  return (
    <LegalPageRenderer
      locale={params.locale}
      folderName="terms-of-use"
      fileName="terms-of-use"
      titleKey="routes.termsOfUse.title"
      dateKey="routes.termsOfUse.lastUpdated"
    />
  );
};

export default TermsOfUsePage;

export const metadata = {
  title: "Terms of Use | CartJO",
  description:
    "Learn how CartJO protects your personal data and privacy while using our e-commerce platform.",
};
