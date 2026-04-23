export default function OpportunitiesLoading() {
  return (
    <div className="container-shell py-10">
      <div className="mb-14 space-y-4">
        <div className="h-6 w-28 animate-pulse rounded-full bg-neutral-200" />
        <div className="h-14 w-96 animate-pulse rounded-xl bg-neutral-200" />
        <div className="h-5 w-80 animate-pulse rounded bg-neutral-200" />
      </div>
      <div className="mb-12 h-12 animate-pulse rounded-xl bg-neutral-200" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-52 animate-pulse rounded-2xl bg-neutral-200" />
        ))}
      </div>
    </div>
  )
}
