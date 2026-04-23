export default function AnnouncementDetailLoading() {
  return (
    <div className="container-shell space-y-8 py-10">
      <div className="h-4 w-64 animate-pulse rounded bg-neutral-200" />
      <div className="grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
        <div className="space-y-6">
          <div className="aspect-[16/9] animate-pulse rounded-2xl bg-neutral-200" />
          <div className="space-y-4 rounded-2xl bg-white p-8 shadow-sm">
            <div className="h-10 w-3/4 animate-pulse rounded bg-neutral-200" />
            <div className="h-4 w-full animate-pulse rounded bg-neutral-200" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-neutral-200" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-neutral-200" />
          </div>
        </div>
        <div className="h-52 animate-pulse rounded-2xl bg-neutral-200" />
      </div>
      <div className="space-y-4">
        <div className="h-6 w-48 animate-pulse rounded bg-neutral-200" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-neutral-200" />
          ))}
        </div>
      </div>
    </div>
  )
}
