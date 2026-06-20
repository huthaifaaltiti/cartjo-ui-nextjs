import ShowcasesPageHeader from "@/components/admin/routes/showcases/ShowcasesPageHeader";

export default async function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full">
      <ShowcasesPageHeader />
      {children}
    </div>
  );
}
