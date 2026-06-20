import CategoriesPageHeader from "@/components/admin/routes/categories/CategoriesPageHeader";

export default async function UsersPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full">
      <CategoriesPageHeader />
      {children}
    </div>
  );
}
