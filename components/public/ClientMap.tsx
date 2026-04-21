'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Configuration de l'icône par défaut de Leaflet pour éviter les problèmes 404 dans Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/markers/marker-icon-2x.png',
  iconUrl: '/markers/marker-icon.png',
  shadowUrl: '/markers/marker-shadow.png',
})

interface MapMarker {
  id: string
  lat: number
  lng: number
  title: string
  count: number
}

// Les coordonnées approximatives des villes principales pour centrer la carte au bon endroit
export const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  'Beijing': { lat: 39.9042, lng: 116.4074 },
  'Shanghai': { lat: 31.2304, lng: 121.4737 },
  'Guangzhou': { lat: 23.1291, lng: 113.2644 },
  'Shenzhen': { lat: 22.5431, lng: 114.0579 },
  'Wuhan': { lat: 30.5928, lng: 114.3055 },
  'Chengdu': { lat: 30.5728, lng: 104.0668 },
  'Hangzhou': { lat: 30.2741, lng: 120.1551 },
  'Nanjing': { lat: 32.0603, lng: 118.7969 },
  'Chongqing': { lat: 29.5630, lng: 106.5516 },
  'Xian': { lat: 34.3416, lng: 108.9398 },
}

// Icône personnalisée pour les marqueurs AECC
const aeccIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface ClientMapProps {
  markers: MapMarker[]
  onCityClick?: (city: string) => void
}

function MapUpdater({ markers }: { markers: MapMarker[] }) {
  const map = useMap()
  
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]))
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 })
    }
  }, [markers, map])

  return null
}

export default function ClientMap({ markers, onCityClick }: ClientMapProps) {
  // Centre par défaut : Centre de la chine approximativement
  const defaultCenter = { lat: 35.8617, lng: 104.1954 }
  
  return (
    <div className="h-full w-full relative z-0">
      <MapContainer 
        center={[defaultCenter.lat, defaultCenter.lng]} 
        zoom={4} 
        scrollWheelZoom={false}
        className="h-full w-full z-0"
        style={{ background: '#f8fafc' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {markers.map((marker) => (
          <Marker 
            key={marker.id} 
            position={[marker.lat, marker.lng]}
            icon={aeccIcon}
            eventHandlers={{
              click: () => {
                if (onCityClick) onCityClick(marker.title)
              },
            }}
          >
            <Popup>
              <div className="text-center p-1">
                <p className="font-bold text-neutral-900 mb-1">{marker.title}</p>
                <p className="text-sm text-neutral-600">{marker.count} membre{marker.count > 1 ? 's' : ''}</p>
                <button 
                  onClick={() => onCityClick && onCityClick(marker.title)}
                  className="mt-2 text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  Voir les profils
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
        <MapUpdater markers={markers} />
      </MapContainer>
    </div>
  )
}
