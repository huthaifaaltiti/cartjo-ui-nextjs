import SubCategoriesPageHeader from "@/components/admin/routes/subCategories/SubCategoriesPageHeader";

export default async function UsersPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full">
      <SubCategoriesPageHeader />
      {children}
    </div>
  );
}
