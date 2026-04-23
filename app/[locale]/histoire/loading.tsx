export default function HistoireLoading() {
  return (
    <div className="space-y-20 py-10">
      <section className="container-shell py-10 md:py-16">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div className="space-y-4">
            <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
            <div className="h-20 w-3/4 animate-pulse rounded-xl bg-neutral-200" />
          </div>
          <div className="h-20 animate-pulse rounded-xl bg-neutral-200" />
        </div>
      </section>
      <section className="bg-neutral-100 py-20">
        <div className="container-shell">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div className="aspect-video animate-pulse rounded-2xl bg-neutral-300" />
            <div className="space-y-4">
              <div className="h-8 w-48 animate-pulse rounded bg-neutral-300" />
              <div className="h-4 w-full animate-pulse rounded bg-neutral-300" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-neutral-300" />
            </div>
          </div>
        </div>
      </section>
      <section className="container-shell space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-neutral-200" />
        ))}
      </section>
    </div>
  )
}
