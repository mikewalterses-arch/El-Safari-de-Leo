import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
import { useUserProfile } from '@/features/user/useUserProfile';
import { Avatar, AVATAR_PRESETS } from '@/components/ui/Avatar';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
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

      <KidInfoSection />

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

      <AchievementsSection />

      <LanguageSection />

      <ViewIntroLink />

      <ChangeUserSection />

      <SignOutSection />
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

function KidInfoSection() {
  const t = useT();
  const { profile, update } = useUserProfile();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [color, setColor] = useState('');
  const [icon, setIcon] = useState<string | undefined>(undefined);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile || editing) return;
    setName(profile.displayName);
    setColor(profile.avatarColor);
    setIcon(profile.avatarIcon);
    const d = profile.birthDate?.toDate();
    setBirthDate(d ? d.toISOString().slice(0, 10) : '');
  }, [profile, editing]);

  const save = async () => {
    setSaving(true);
    try {
      await update({
        displayName: name.trim() || profile?.displayName,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        avatarColor: color,
        avatarIcon: icon ?? '',
      });
      setEditing(false);
    } catch (err) {
      console.error('update profile failed', err);
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return null;

  return (
    <section className="rounded-card border border-foreground/10 bg-cream p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold">{t('profile.kidTitle')}</h3>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-sm font-semibold text-primary"
          >
            {t('profile.edit')}
          </button>
        )}
      </div>

      {!editing ? (
        <div className="mt-2 flex items-center gap-3">
          <Avatar
            icon={profile.avatarIcon}
            color={profile.avatarColor}
            fallbackInitial={profile.displayName.charAt(0)}
            size={56}
          />
          <div>
            <p className="font-extrabold">{profile.displayName}</p>
            {profile.birthDate && (
              <p className="text-xs text-foreground/60">
                {profile.birthDate.toDate().toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-3 space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-foreground/60">
              {t('profile.kidName')}
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-button border border-foreground/15 bg-surface px-3 py-2 text-base focus:border-primary focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-foreground/60">
              {t('profile.kidBirthDate')}
            </span>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full rounded-button border border-foreground/15 bg-surface px-3 py-2 text-base focus:border-primary focus:outline-none"
            />
          </label>
          <div>
            <p className="mb-2 text-xs font-semibold text-foreground/60">
              {t('profile.kidAvatar')}
            </p>
            <div className="grid grid-cols-5 gap-2">
              {AVATAR_PRESETS.map((preset) => {
                const selected = preset.icon === icon && preset.color === color;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setIcon(preset.icon);
                      setColor(preset.color);
                    }}
                    aria-label={preset.id}
                    className={cn(
                      'flex aspect-square items-center justify-center rounded-full border-2 transition-transform',
                      selected
                        ? 'border-foreground scale-105'
                        : 'border-transparent',
                    )}
                  >
                    <Avatar
                      icon={preset.icon}
                      color={preset.color}
                      size={48}
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              disabled={saving}
              className="flex-1 rounded-button border border-foreground/20 py-2 text-sm font-semibold disabled:opacity-50"
            >
              {t('diary.noteCancel')}
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="flex-[2] rounded-button bg-accent py-2 text-sm font-extrabold text-foreground shadow-soft disabled:opacity-50"
            >
              {saving ? '...' : t('profile.save')}
            </button>
          </div>
        </div>
      )}
    </section>
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

function ViewIntroLink() {
  const t = useT();
  return (
    <Link
      to="/intro"
      className="block w-full rounded-button border border-foreground/15 bg-cream py-3 text-center text-sm font-semibold text-foreground/70 transition-colors hover:border-primary"
    >
      {t('profile.viewIntro')}
    </Link>
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

function SignOutSection() {
  const t = useT();
  return (
    <button
      type="button"
      onClick={() => signOut(auth)}
      className="w-full rounded-button border border-coral/30 bg-coral/5 py-3 text-sm font-semibold text-coral"
    >
      {t('profile.signOut')}
    </button>
  );
}
