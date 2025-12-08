import fs from "fs";
import path from "path";
import { marked } from "marked";
import { useTranslations } from "next-intl";
import LegalPageHeader from "@/components/user/legal/LegalPageHeader";
import { Locale } from "@/types/locale";

type LegalPageRendererProps = {
  locale: Locale | string;
  folderName: string;
  fileName: string;
  titleKey: string;
  dateKey: string;
};

const LegalPageRenderer = ({
  locale,
  folderName,
  fileName,
  titleKey,
  dateKey,
}: LegalPageRendererProps) => {
  const t = useTranslations();
  const lang = locale === "ar" ? "ar" : "en";

  const filePath = path.join(
    process.cwd(),
    "src",
    "content",
    "legal",
    folderName,
    `${fileName}-${lang}.md`
  );

  if (!fs.existsSync(filePath)) {
    throw new Error(`Policy file not found: ${fileName}-${lang}.md`);
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const htmlContent = marked(fileContent);

  return (
    <div
      className={`container mx-auto px-6 py-10 prose prose-lg max-w-none ${
        lang === "ar" ? "rtl text-right" : "ltr text-left"
      }`}
    >
      <LegalPageHeader title={t(titleKey)} date={t(dateKey)} />
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export default LegalPageRenderer;
