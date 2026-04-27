import { forwardRef } from 'react';
import { Calendar, MapPin } from 'lucide-react';

interface ShareCardProps {
  photoUrl: string;
  animalName: string;
  placeName?: string;
  date?: Date;
  kidName: string;
}

/**
 * Tarjeta JPG generable con html2canvas. Diseño cuadrado tipo Instagram para
 * compartir un avistamiento por WhatsApp/email/etc.
 *
 * Renderizada off-screen cuando se invoca compartir, capturada y enviada
 * vía navigator.share o descargada como fallback.
 */
export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  function ShareCard({ photoUrl, animalName, placeName, date, kidName }, ref) {
    const dateStr =
      date?.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }) ?? '';

    return (
      <div
        ref={ref}
        style={{
          width: 600,
          height: 600,
          background: '#FFF9F2',
          padding: 32,
          fontFamily: '"Nunito", system-ui, sans-serif',
          color: '#3D2B1F',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <img
          src={photoUrl}
          crossOrigin="anonymous"
          alt=""
          style={{
            width: '100%',
            height: 360,
            objectFit: 'cover',
            borderRadius: 16,
            boxShadow: '0 4px 12px rgba(61, 43, 31, 0.12)',
          }}
        />
        <div style={{ flex: 1 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 32,
              fontWeight: 800,
              lineHeight: 1.1,
            }}
          >
            {animalName}
          </h2>
          {placeName && (
            <p
              style={{
                margin: '8px 0 0',
                fontSize: 14,
                color: '#3D2B1F99',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <MapPin size={14} /> {placeName}
            </p>
          )}
          {dateStr && (
            <p
              style={{
                margin: '4px 0 0',
                fontSize: 14,
                color: '#3D2B1F99',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Calendar size={14} /> {dateStr}
            </p>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            paddingTop: 12,
            borderTop: '1px solid rgba(61, 43, 31, 0.08)',
          }}
        >
          <img
            src="/icons/safari-de-leo-source.svg"
            crossOrigin="anonymous"
            alt=""
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
            }}
          />
          <span style={{ fontSize: 14, fontWeight: 800 }}>
            El Safari de {kidName}
          </span>
        </div>
      </div>
    );
  },
);
