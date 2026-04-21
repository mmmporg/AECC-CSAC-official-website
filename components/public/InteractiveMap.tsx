'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'

// On charge la carte dynamiquement, UNIQUEMENT côté client (SSR: false)
// C'est indispensable car Leaflet utilise l'objet "window" qui n'existe pas côté serveur.
const ClientMap = dynamic(() => import('./ClientMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-neutral-100">
      <div className="flex flex-col items-center gap-4 text-neutral-400">
        <svg className="h-8 w-8 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-sm font-medium uppercase tracking-widest">Chargement de la carte...</p>
      </div>
    </div>
  ),
})

interface MarkerData {
  id: string
  lat: number
  lng: number
  title: string
  count: number
}

interface InteractiveMapProps {
  markers: MarkerData[]
  onCityClick?: (city: string) => void
}

export function InteractiveMap({ markers, onCityClick }: InteractiveMapProps) {
  // On s'assure que ClientMap ne re-render pas continuellement
  const memoizedMarkers = useMemo(() => markers, [markers])

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 shadow-sm md:h-[500px]">
      <ClientMap markers={memoizedMarkers} onCityClick={onCityClick} />
      
      <div className="pointer-events-none absolute bottom-4 right-4 z-10 flex flex-col gap-2">
        <div className="rounded-lg bg-white/90 px-3 py-2 shadow-sm backdrop-blur">
          <p className="text-xs font-semibold text-neutral-700">Membres Actifs en Chine</p>
        </div>
      </div>
    </div>
  )
}
