import OrdersPageHeader from "@/components/admin/routes/orders/OrdersPageHeader";

export default async function UsersPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full">
      <OrdersPageHeader />
      {children}
    </div>
  );
}
