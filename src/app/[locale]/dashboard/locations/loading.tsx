import Spinner from "@/components/shared/Spinner";

export default function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
