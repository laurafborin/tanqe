'use client'

import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

export interface MapMarker {
  id: string
  lat: number
  lng: number
  label: string
  score?: number
  subtitle?: string
}

interface MapViewProps {
  center: [number, number]
  zoom?: number
  markers: MapMarker[]
  height?: number
}

function makeIcon(initial: string) {
  return L.divIcon({
    className: 'tanqe-marker',
    html: `<div style="
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #E8581A;
      border: 2px solid #FFFFFF;
      box-shadow: 0 2px 8px rgba(15,15,14,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      font-family: var(--font-display), Syne, sans-serif;
      font-weight: 800;
      font-size: 12px;
      letter-spacing: -0.04em;
    ">${initial}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  })
}

function renderStars(score?: number) {
  if (!score) return ''
  const filled = Math.round(score)
  const empty = 5 - filled
  return '★'.repeat(filled) + '☆'.repeat(empty)
}

export default function MapView({
  center,
  zoom = 10,
  markers,
  height = 320,
}: MapViewProps) {
  return (
    <div style={{ width: '100%', height, borderRadius: 4, overflow: 'hidden' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {markers.map((m) => (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            icon={makeIcon(m.label.charAt(0).toUpperCase())}
          >
            <Popup>
              <div
                style={{
                  fontFamily: 'var(--font-body), DM Sans, sans-serif',
                  minWidth: 180,
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display), Syne, sans-serif',
                    fontWeight: 700,
                    fontSize: 14,
                    color: '#0F0F0E',
                    marginBottom: 4,
                  }}
                >
                  {m.label}
                </div>
                {m.subtitle && (
                  <div style={{ fontSize: 12, color: '#7A7870', marginBottom: 6 }}>
                    {m.subtitle}
                  </div>
                )}
                {m.score && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontFamily: 'var(--font-mono), DM Mono, monospace',
                      fontSize: 11,
                      letterSpacing: '0.06em',
                      color: '#7A7870',
                      textTransform: 'uppercase',
                    }}
                  >
                    <span style={{ color: '#E8581A', fontSize: 14 }}>
                      {renderStars(m.score)}
                    </span>
                    <span>{m.score.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
