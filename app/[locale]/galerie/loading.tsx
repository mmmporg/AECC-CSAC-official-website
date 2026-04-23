export default function GalerieLoading() {
  return (
    <div className="space-y-20 py-10">
      <section className="container-shell py-10 md:py-16">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div className="space-y-4">
            <div className="h-6 w-28 animate-pulse rounded-full bg-neutral-200" />
            <div className="h-20 w-2/3 animate-pulse rounded-xl bg-neutral-200" />
          </div>
          <div className="h-20 animate-pulse rounded-xl bg-neutral-200" />
        </div>
      </section>
      <section className="container-shell">
        <div className="mb-8 h-8 w-32 animate-pulse rounded bg-neutral-200" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-2xl bg-neutral-200" />
          ))}
        </div>
      </section>
    </div>
  )
}
