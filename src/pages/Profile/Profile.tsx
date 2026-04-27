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
import { AchievementsSection } from '@/features/achievements/AchievementsSection';
import { useUserTypeStore } from '@/features/auth/userType';
import {
  LOCALE_NAMES,
  SUPPORTED_LOCALES,
  useLocaleStore,
  useT,
} from '@/i18n';
import { cn } from '@/lib/cn';

const CHART_COLORS = [
  '#7DD3C7',
  '#FF9B85',
  '#FFE5A0',
  '#B8E0A0',
  '#9CC0BD',
  '#D9A28A',
  '#A0B8E0',
];

export function Profile() {
  const t = useT();
  const { sightings } = useSightings();
  const { animals } = useAnimals();

  const taxonomyData = useMemo(() => {
    const counts = new Map<string, number>();
    for (const s of sightings) {
      const animal = animals.get(s.animalId);
      const className =
        animal?.taxonomicClass?.name ?? t('collection.unclassified');
      counts.set(className, (counts.get(className) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));
  }, [sightings, animals, t]);

  const totalSightings = sightings.length;
  const uniqueAnimals = new Set(sightings.map((s) => s.animalId)).size;
  const uniquePlaces = new Set(
    sightings.map((s) => s.location?.placeName).filter(Boolean),
  ).size;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold">{t('profile.title')}</h2>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label={t('profile.statsAvistamientos')} value={totalSightings} />
        <StatCard label={t('profile.statsAnimales')} value={uniqueAnimals} />
        <StatCard label={t('profile.statsLugares')} value={uniquePlaces} />
      </div>

      <section className="rounded-card border border-foreground/10 bg-cream p-4">
        <h3 className="text-lg font-extrabold">{t('profile.taxonomyTitle')}</h3>
        {taxonomyData.length === 0 ? (
          <p className="mt-3 text-sm text-foreground/60">
            {t('profile.taxonomyEmpty')}
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
                    <Cell
                      key={idx}
                      fill={CHART_COLORS[idx % CHART_COLORS.length]}
                    />
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

      <AchievementsSection />

      <LanguageSection />

      <ChangeUserSection />
    </div>
  );
}

function ChangeUserSection() {
  const t = useT();
  const clearUserType = useUserTypeStore((s) => s.clear);
  return (
    <button
      type="button"
      onClick={clearUserType}
      className="w-full rounded-button border border-foreground/15 bg-cream py-3 text-sm font-semibold text-foreground/70 transition-colors hover:border-primary"
    >
      {t('profile.changeUser')}
    </button>
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

function LanguageSection() {
  const t = useT();
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);

  return (
    <section className="rounded-card border border-foreground/10 bg-cream p-4">
      <h3 className="text-lg font-extrabold">{t('profile.languageTitle')}</h3>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {SUPPORTED_LOCALES.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            className={cn(
              'rounded-button border px-4 py-3 text-sm font-extrabold transition-colors',
              locale === l
                ? 'border-primary bg-primary text-foreground'
                : 'border-foreground/15 bg-surface text-foreground/70',
            )}
          >
            {LOCALE_NAMES[l]}
          </button>
        ))}
      </div>
    </section>
  );
}
