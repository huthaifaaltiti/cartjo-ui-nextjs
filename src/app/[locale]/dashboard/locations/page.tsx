import { fetchLocations } from "@/hooks/react-query/useLocations";
import LocationsPageContainer from "@/components/admin/routes/locations/LocationsPageContainer";

export default async function LocationsPage() {
  const { locations } = await fetchLocations();

  return (
    <div className="w-full h-full">
      <LocationsPageContainer locations={locations} />
    </div>
  );
}
