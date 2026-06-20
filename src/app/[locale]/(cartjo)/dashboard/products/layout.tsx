import ProductsPageHeader from "@/components/admin/routes/products/ProductsPageHeader";

export default async function UsersPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full">
      <ProductsPageHeader />
      {children}
    </div>
  );
}
