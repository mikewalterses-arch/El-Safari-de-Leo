import { useMemo } from 'react';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { useAnimals } from '@/features/animals/useAnimals';
import { useSightings } from '@/features/sightings/useSightings';

const CHART_COLORS = [
  '#7DD3C7', // turquesa
  '#FF9B85', // coral
  '#FFE5A0', // amarillo crema
  '#B8E0A0', // verde lima
  '#9CC0BD', // turquesa apagado
  '#D9A28A', // coral apagado
  '#A0B8E0', // azul suave
];

export function Profile() {
  const { sightings } = useSightings();
  const { animals } = useAnimals();

  const taxonomyData = useMemo(() => {
    const counts = new Map<string, number>();
    for (const s of sightings) {
      const animal = animals.get(s.animalId);
      const className = animal?.taxonomicClass?.name ?? 'Sin clasificar';
      counts.set(className, (counts.get(className) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));
  }, [sightings, animals]);

  const totalSightings = sightings.length;
  const uniqueAnimals = new Set(sightings.map((s) => s.animalId)).size;
  const uniquePlaces = new Set(
    sightings.map((s) => s.location?.placeName).filter(Boolean),
  ).size;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold">Perfil</h2>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Avistamientos" value={totalSightings} />
        <StatCard label="Animales" value={uniqueAnimals} />
        <StatCard label="Lugares" value={uniquePlaces} />
      </div>

      <section className="rounded-card border border-foreground/10 bg-cream p-4">
        <h3 className="text-lg font-extrabold">Tus tipos de animales</h3>
        {taxonomyData.length === 0 ? (
          <p className="mt-3 text-sm text-foreground/60">
            Cuando hagas avistamientos, aquí verás un gráfico con los tipos de animales que has visto (mamíferos, aves, reptiles...).
          </p>
        ) : (
          <div className="mt-3" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taxonomyData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={40}
                >
                  {taxonomyData.map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-card border border-foreground/10 bg-cream p-3 text-center">
      <p className="text-3xl font-extrabold text-primary">{value}</p>
      <p className="mt-1 text-xs font-semibold text-foreground/60">{label}</p>
    </div>
  );
}
