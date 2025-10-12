import fs from "fs";
import path from "path";
import { marked } from "marked";

type PrivacyPolicyPageProps = {
  params: {
    locale: string;
  };
};

const PrivacyPolicyPage = ({ params }: PrivacyPolicyPageProps) => {
  const { locale } = params;
  const lang = locale === "ar" ? "ar" : "en"; 

  const filePath = path.join(process.cwd(), "src", "content", "policies", `privacy-policy-${lang}.md`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Privacy policy file not found for locale: ${lang}`);
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const htmlContent = marked(fileContent);

  return (
    <div
      className={`container mx-auto px-6 py-10 prose prose-lg max-w-none ${
        lang === "ar" ? "rtl text-right" : "ltr text-left"
      }`}
    >
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export default PrivacyPolicyPage;

export const metadata = {
  title: "Privacy Policy | CartJO",
  description:
    "Learn how CartJO protects your personal data and privacy while using our e-commerce platform.",
};
