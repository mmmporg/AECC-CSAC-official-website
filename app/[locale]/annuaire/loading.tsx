export default function AnnuaireLoading() {
  return (
    <div className="container-shell py-12 md:py-20 space-y-8">
      <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
        <div className="space-y-4 max-w-2xl w-full">
          <div className="h-6 w-28 animate-pulse rounded-full bg-neutral-200" />
          <div className="h-14 w-72 animate-pulse rounded-xl bg-neutral-200" />
          <div className="h-5 w-96 animate-pulse rounded bg-neutral-200" />
        </div>
        <div className="h-12 w-40 animate-pulse rounded-xl bg-neutral-200" />
      </div>
      <div className="h-64 animate-pulse rounded-2xl bg-neutral-200" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl bg-neutral-200" />
        ))}
      </div>
    </div>
  )
}
