import { memo } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

interface StatusMessageProps {
  message: string;
  type: "success" | "error" | "";
}

const StatusMessage: React.FC<StatusMessageProps> = ({ message, type }) => {
  if (!message) return null;

  const isSuccess = type === "success";
  const Icon = isSuccess ? CheckCircle : AlertCircle;
  const bgColor = isSuccess
    ? "bg-green-50 border-green-200"
    : "bg-red-50 border-red-200";
  const textColor = isSuccess ? "text-green-800" : "text-red-800";
  const iconColor = isSuccess ? "text-green-600" : "text-red-600";

  return (
    <div className={`border rounded-lg p-4 mb-6 ${bgColor}`}>
      <div className="flex items-center space-x-3">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        <p className={`font-medium ${textColor}`}>{message}</p>
      </div>
    </div>
  );
};

export default memo(StatusMessage);
