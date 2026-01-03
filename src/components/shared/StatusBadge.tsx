import { Statuses } from "@/enums/statuses.enum";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type StatusBadgeProps = {
  status: string;
  className?: string;
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const t = useTranslations("general.status");

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      // Pending
      case Statuses.PENDING:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";

      // In progress / preparing
      case Statuses.CONFIRMED:
      case Statuses.PREPARING:
      case Statuses.SHIPPED:
      case Statuses.OUT_FOR_DELIVERY:
        return "bg-blue-100 text-blue-800 border-blue-200";

      // Success
      case Statuses.DELIVERED:
      case Statuses.PAID:
      case Statuses.ONLINE:
        return "bg-green-100 text-green-800 border-green-200";

      // Error / canceled / returned / offline
      case Statuses.FAILED:
      case Statuses.CANCELED:
      case Statuses.RETURNED:
      case Statuses.OFFLINE:
        return "bg-red-100 text-red-800 border-red-200";

      // Refunded
      case Statuses.REFUNDED:
        return "bg-purple-100 text-purple-800 border-purple-200";

      // 🔹 Delivery source
      case Statuses.INTERNAL:
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case Statuses.OUTSOURCED:
        return "bg-orange-100 text-orange-800 border-orange-200";

      // Default
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={cn(
        `px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
          status
        )}`,
        className
      )}
    >
      {t(status?.toLowerCase())}
    </span>
  );
}
