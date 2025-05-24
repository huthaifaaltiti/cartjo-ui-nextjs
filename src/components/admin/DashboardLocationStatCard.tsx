import { MapPin } from "lucide-react";
import { memo } from "react";

const DashboardLocationStatCard: React.FC<{
  label: string;
  value: number;
  color: "blue" | "green" | "purple";
}> = ({ label, value, color }) => {
  const colors: Record<"blue" | "green" | "purple", string> = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <MapPin className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default memo(DashboardLocationStatCard);
