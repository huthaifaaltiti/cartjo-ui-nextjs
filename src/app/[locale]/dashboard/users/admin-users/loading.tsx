import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function AdminUsersLoadingPage() {
  return (
    <div className="w-full min-h-[55vh] h-full flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}
