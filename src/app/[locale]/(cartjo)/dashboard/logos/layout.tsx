import LogosPageHeader from "@/components/admin/routes/logos/LogosPageHeader";

export default async function UsersPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full">
      <LogosPageHeader />
      {children}
    </div>
  );
}
