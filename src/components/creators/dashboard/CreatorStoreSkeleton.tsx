const CreatorStoreSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6">
      {/* Banner + logo header */}
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <div className="h-40 w-full bg-slate-200" />
        <div className="flex items-end gap-4 bg-slate-100 px-6 pb-5">
          <div className="-mt-8 h-20 w-20 shrink-0 rounded-xl border-4 border-white bg-slate-300" />
          <div className="flex flex-1 flex-wrap items-center justify-between gap-3 pt-3">
            <div className="space-y-2">
              <div className="h-5 w-40 rounded bg-slate-300" />
              <div className="h-3.5 w-24 rounded bg-slate-200" />
            </div>
            <div className="h-6 w-20 rounded-full bg-slate-200" />
          </div>
        </div>
      </div>

      {/* Tagline / bio */}
      <div className="rounded-xl border border-slate-200 p-5">
        <div className="h-4 w-3/5 rounded bg-slate-300" />
        <div className="mt-2 h-3.5 w-4/5 rounded bg-slate-200" />
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-200 p-4">
            <div className="h-3 w-16 rounded bg-slate-200" />
            <div className="mt-2 h-4 w-20 rounded bg-slate-300" />
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="rounded-xl border border-slate-200 p-5">
        <div className="mb-3 h-3.5 w-20 rounded bg-slate-200" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-14 rounded bg-slate-200" />
              <div className="h-4 w-28 rounded bg-slate-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="rounded-xl border border-slate-200 p-5">
        <div className="mb-3 h-3.5 w-32 rounded bg-slate-200" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-8 rounded-lg bg-slate-200"
              style={{ width: 90 + (i % 3) * 20 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatorStoreSkeleton;
