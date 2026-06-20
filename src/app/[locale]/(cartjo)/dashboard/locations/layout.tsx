import LocationsPageHeader from "@/components/admin/routes/locations/LocationsPageHeader";

export default async function LocationsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full">
      <LocationsPageHeader />
      {children}
    </div>
  );
}
