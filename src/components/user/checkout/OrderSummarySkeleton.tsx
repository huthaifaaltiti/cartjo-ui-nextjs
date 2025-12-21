export default function OrderSummarySkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8 animate-pulse">
      {/* Title */}
      <div className="h-6 w-40 bg-slate-200 rounded mb-6" />

      <div className="space-y-4">
        {/* Subtotal row */}
        <div className="flex justify-between">
          <div className="h-4 w-24 bg-slate-200 rounded" />
          <div className="h-4 w-20 bg-slate-200 rounded" />
        </div>

        {/* Divider */}
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="h-3 w-16 bg-slate-200 rounded" />
            <div className="h-3 w-32 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
