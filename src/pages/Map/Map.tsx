import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAnimals } from '@/features/animals/useAnimals';
import { useSightings } from '@/features/sightings/useSightings';
import { useT } from '@/i18n';

const MADRID_FALLBACK: [number, number] = [40.4168, -3.7038];

// Marker custom: círculo turquesa grande con borde crema, área tappable amplia.
const customIcon = L.divIcon({
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

// Sub-componente que vuela al primer avistamiento (el más reciente, dado el
// `orderBy desc`). Usa useMap() porque solo está disponible dentro del
// MapContainer.
function FlyToFirst({ position }: { position: [number, number] | null }) {
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

  const validSightings = useMemo(
    () =>
      sightings.filter(
        (s) => s.location && (s.location.lat !== 0 || s.location.lng !== 0),
      ),
    [sightings],
  );

  const center = useMemo<[number, number]>(() => {
    if (validSightings.length === 0) return MADRID_FALLBACK;
    const first = validSightings[0]!;
    return [first.location.lat, first.location.lng];
  }, [validSightings]);

  const flyTarget = validSightings.length > 0 ? center : null;

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
          zoom={validSightings.length > 0 ? 6 : 4}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FlyToFirst position={flyTarget} />
          {validSightings.map((s) => {
            const animal = animals.get(s.animalId);
            return (
              <Marker
                key={s.id}
                position={[s.location.lat, s.location.lng]}
                icon={customIcon}
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
