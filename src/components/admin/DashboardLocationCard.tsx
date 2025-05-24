import { DollarSign, MapPin } from "lucide-react";
import { memo, useState } from "react";

type LocationData = {
  name: { ar: string; en: string };
  price: string;
  subLocations: LocationData[];
};

type LocationCardProps = {
  location: LocationData;
  level?: number;
};

const DashboardLocationCard = ({ location, level = 0 }: LocationCardProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const marginLeft = level * 24;
  const bgColor =
    level === 0 ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200";

  return (
    <div
      className={`border rounded-lg p-4 mb-3 ${bgColor}`}
      style={{ marginLeft: `${marginLeft}px` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MapPin className="h-5 w-5 text-blue-600" />
          <div>
            <h3 className="font-semibold text-lg text-gray-800">
              {location.name.en} / {location.name.ar}
            </h3>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-700">
              ${location.price}
            </span>
          </div>
          {location.subLocations.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {isExpanded ? "Hide" : "Show"} ({location.subLocations.length})
            </button>
          )}
        </div>
      </div>

      {isExpanded && location.subLocations.length > 0 && (
        <div className="mt-4">
          {location.subLocations.map((subLocation, index) => (
            <DashboardLocationCard
              key={index}
              location={subLocation}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(DashboardLocationCard);
