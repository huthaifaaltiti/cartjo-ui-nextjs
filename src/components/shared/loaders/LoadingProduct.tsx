import { Loader2 } from "lucide-react";

const LoadingProductButton = ({ color }: { color?: string }) => {
  return (
    <Loader2
      className={`w-5 h-5 ${
        color ? "text-[color]" : "text-primary-500"
      } animate-spin`}
    />
  );
};

export default LoadingProductButton;
