export default function HomeLoading() {
  return (
    <div className="overflow-x-hidden">
      <div className="h-[70vh] animate-pulse bg-neutral-100" />
      <div className="container-shell py-16 space-y-6">
        <div className="flex gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 flex-1 animate-pulse rounded-xl bg-neutral-200" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-neutral-200" />
          ))}
        </div>
      </div>
    </div>
  )
}
