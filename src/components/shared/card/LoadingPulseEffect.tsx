export default function LoadingPulseEffect({
  isLoading,
}: {
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="absolute inset-0 z-50 rounded-2xl bg-gradient-to-br from-primary-50/20 to-blue-50/20 animate-pulse pointer-events-none"></div>
    );
  }
}
