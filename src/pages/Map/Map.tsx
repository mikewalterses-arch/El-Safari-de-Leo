import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAnimals } from '@/features/animals/useAnimals';
import { useSightings } from '@/features/sightings/useSightings';
import { useT } from '@/i18n';

const MADRID_FALLBACK: [number, number] = [40.4168, -3.7038];

// Marker de avistamiento: círculo turquesa grande con borde crema.
const sightingIcon = L.divIcon({
  html:
    '<div style="' +
    'width:36px;height:36px;border-radius:50%;background:#7DD3C7;' +
    'border:4px solid #FFF9F2;' +
    'box-shadow:0 4px 12px rgba(61,43,31,0.25);' +
    '"></div>',
  className: 'safari-marker',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -20],
});

// Marker "estás aquí": círculo azul pulsante (estilo Google Maps).
const youAreHereIcon = L.divIcon({
  html:
    '<div style="position:relative;width:18px;height:18px;">' +
    '<div style="position:absolute;inset:0;border-radius:50%;background:#3F8DFF;border:3px solid #FFFFFF;box-shadow:0 0 0 2px rgba(63,141,255,0.35);"></div>' +
    '</div>',
  className: 'safari-you-marker',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function FlyTo({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 14, { duration: 1.5 });
    }
  }, [map, position]);
  return null;
}

export function Map() {
  const t = useT();
  const { sightings, loading } = useSightings();
  const { animals } = useAnimals();
  const [currentPos, setCurrentPos] = useState<[number, number] | null>(null);

  // Posición actual ("estás aquí"). Si el usuario deniega permiso, simplemente
  // no aparece el marker azul; el resto del mapa funciona igual.
  useEffect(() => {
    if (!('geolocation' in navigator)) return;
    let cancelled = false;
    navigator.geolocation.getCurrentPosition(
      (p) => {
        if (cancelled) return;
        setCurrentPos([p.coords.latitude, p.coords.longitude]);
      },
      () => {},
      { timeout: 10_000, maximumAge: 60_000 },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const validSightings = useMemo(
    () =>
      sightings.filter(
        (s) => s.location && (s.location.lat !== 0 || s.location.lng !== 0),
      ),
    [sightings],
  );

  // Centro inicial: primer avistamiento si hay, si no posición actual, si no Madrid.
  const center = useMemo<[number, number]>(() => {
    if (validSightings.length > 0) {
      const first = validSightings[0]!;
      return [first.location.lat, first.location.lng];
    }
    if (currentPos) return currentPos;
    return MADRID_FALLBACK;
  }, [validSightings, currentPos]);

  // Vuela a: el primer avistamiento si existe, si no a la posición actual.
  const flyTarget = validSightings.length > 0 ? center : currentPos;

  if (loading) {
    return <p className="text-foreground/60">{t('common.loading')}</p>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-extrabold">{t('map.title')}</h2>
        {validSightings.length > 0 ? (
          <p className="mt-1 text-foreground/60">
            {t('map.count', { count: validSightings.length })}
          </p>
        ) : (
          <p className="mt-1 text-foreground/60">{t('map.empty')}</p>
        )}
      </div>

      <div
        className="overflow-hidden rounded-card shadow-card"
        style={{ height: '60vh', minHeight: 360 }}
      >
        <MapContainer
          center={center}
          zoom={validSightings.length > 0 || currentPos ? 13 : 4}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FlyTo position={flyTarget} />

          {currentPos && (
            <Marker position={currentPos} icon={youAreHereIcon}>
              <Popup>{t('map.youAreHere')}</Popup>
            </Marker>
          )}

          {validSightings.map((s) => {
            const animal = animals.get(s.animalId);
            return (
              <Marker
                key={s.id}
                position={[s.location.lat, s.location.lng]}
                icon={sightingIcon}
              >
                <Popup>
                  <div style={{ minWidth: 160 }}>
                    {s.thumbnailUrl && (
                      <img
                        src={s.thumbnailUrl}
                        alt=""
                        style={{
                          width: '100%',
                          height: 110,
                          objectFit: 'cover',
                          borderRadius: 8,
                        }}
                      />
                    )}
                    <p style={{ fontWeight: 800, marginTop: 8, marginBottom: 0 }}>
                      {animal?.commonName ?? t('newSighting.animal')}
                    </p>
                    {s.location.placeName && (
                      <p style={{ fontSize: 12, color: '#666', margin: '4px 0 0' }}>
                        {s.location.placeName}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
