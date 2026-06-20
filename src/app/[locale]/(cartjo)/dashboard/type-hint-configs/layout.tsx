import TypeHintConfigsPageHeader from "@/components/admin/routes/typeHintConfigs/TypeHintConfigsPageHeader";

export default async function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full">
      <TypeHintConfigsPageHeader />
      {children}
    </div>
  );
}
