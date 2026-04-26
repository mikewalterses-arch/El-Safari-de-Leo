import { useMemo } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { useAnimals } from '@/features/animals/useAnimals';
import { useSightings } from '@/features/sightings/useSightings';

// Fix conocido de Leaflet con bundlers: el _getIconUrl por defecto apunta a
// rutas relativas que no existen tras el build. Forzamos las URLs importadas.
type IconDefaultPrototype = { _getIconUrl?: () => string };
delete (L.Icon.Default.prototype as IconDefaultPrototype)._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

const MADRID_FALLBACK: [number, number] = [40.4168, -3.7038];

export function Map() {
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

  if (loading) {
    return <p className="text-foreground/60">Cargando mapa...</p>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-extrabold">Mapa</h2>
        {validSightings.length > 0 ? (
          <p className="mt-1 text-foreground/60">
            {validSightings.length}{' '}
            {validSightings.length === 1 ? 'avistamiento' : 'avistamientos'} con ubicación.
          </p>
        ) : (
          <p className="mt-1 text-foreground/60">
            Cuando hagas tu primer avistamiento con ubicación aparecerá aquí.
          </p>
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
          {validSightings.map((s) => {
            const animal = animals.get(s.animalId);
            return (
              <Marker key={s.id} position={[s.location.lat, s.location.lng]}>
                <Popup>
                  <div style={{ minWidth: 140 }}>
                    {s.thumbnailUrl && (
                      <img
                        src={s.thumbnailUrl}
                        alt=""
                        style={{
                          width: '100%',
                          height: 100,
                          objectFit: 'cover',
                          borderRadius: 8,
                        }}
                      />
                    )}
                    <p style={{ fontWeight: 800, marginTop: 8, marginBottom: 0 }}>
                      {animal?.commonName ?? 'Animal'}
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
