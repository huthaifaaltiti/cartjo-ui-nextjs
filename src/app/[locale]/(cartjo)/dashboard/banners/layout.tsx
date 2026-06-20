import BannersPageHeader from "@/components/admin/routes/banners/BannersPageHeader";

export default async function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full">
      <BannersPageHeader />
      {children}
    </div>
  );
}
