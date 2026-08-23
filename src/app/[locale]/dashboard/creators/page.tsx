import DashboardCreatorsPageContainer from "@/components/admin/routes/creators/DashboardCreatorsPageContainer";
import { Locale } from "@/types/locale";

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

const DashboardCreatorsPage = async ({ params }: PageProps) => {
  const { locale } = await params;

  return <DashboardCreatorsPageContainer locale={locale} />;
};

export default DashboardCreatorsPage;
