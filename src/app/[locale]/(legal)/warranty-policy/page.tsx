import LegalPageRenderer from "@/components/user/legal/LegalPageRenderer";
import { generateLocalizedMetadata } from "@/utils/generateMetadata";
type WarrantyPolicyPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const WarrantyPolicyPage = async ({ params }: WarrantyPolicyPageProps) => {
  const { locale } = await params;

  return (
    <LegalPageRenderer
      locale={locale}
      folderName="warranty-policy"
      fileName="warranty-policy"
      titleKey="routes.warrantyPolicy.title"
      dateKey="routes.warrantyPolicy.lastUpdated"
    />
  );
};

export default WarrantyPolicyPage;

export async function generateMetadata({ params }: WarrantyPolicyPageProps) {
  const { locale } = await params;

  return generateLocalizedMetadata({
    locale,
    titleAr: "سياسة الضمان | كارت جو",
    titleEn: "Warranty Policy | CartJO",
    descAr:
      "تعرف على كيفية حماية كارت جو لحقوق العملاء وضمان المنتجات أثناء التسوق على منصتنا.",
    descEn:
      "Learn about CartJO’s warranty policy and how we ensure customer rights and product protection.",
  });
}
