export default function LoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-white-50/60 backdrop-blur-[1px] z-50 flex items-center justify-center">
      <div className="bg-white-50 rounded-full p-3 shadow-lg">
        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
