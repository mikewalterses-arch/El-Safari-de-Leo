import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { Plus, Trash2, Sparkles, HelpCircle } from 'lucide-react';
import { useAnimals } from '@/features/animals/useAnimals';
import { useSightings } from '@/features/sightings/useSightings';
import { AchievementsSection } from '@/features/achievements/AchievementsSection';
import { useUserTypeStore } from '@/features/auth/userType';
import { useKids } from '@/features/kids/useKids';
import { addKid, removeKid, updateKid } from '@/features/kids/kidMutations';
import { useAuth } from '@/features/auth/useAuth';
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
import type { KidProfile } from '@/types/models';

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

      <KidsSection />

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

      <HelpLink />

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

/** Sección de gestión de peques: lista, selector activo, añadir/editar/borrar. */
function KidsSection() {
  const t = useT();
  const { kids, activeKidId, setActiveKidId } = useKids();
  const [editingKid, setEditingKid] = useState<KidProfile | null>(null);
  const [adding, setAdding] = useState(false);

  return (
    <section className="rounded-card border border-foreground/10 bg-cream p-4">
      <h3 className="text-lg font-extrabold">{t('profile.kidsTitle')}</h3>

      <ul className="mt-3 space-y-2">
        {kids.map((kid) => (
          <li
            key={kid.id}
            className={cn(
              'flex items-center gap-3 rounded-card border p-3 transition-colors',
              kid.id === activeKidId
                ? 'border-primary bg-primary/10'
                : 'border-foreground/10 bg-surface',
            )}
          >
            <button
              type="button"
              onClick={() => setActiveKidId(kid.id)}
              className="flex flex-1 items-center gap-3"
            >
              <Avatar
                icon={kid.avatarIcon}
                color={kid.avatarColor}
                fallbackInitial={kid.displayName.charAt(0)}
                size={48}
              />
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate font-extrabold">{kid.displayName}</p>
                {kid.id === activeKidId && (
                  <p className="text-xs text-primary">{t('profile.activeKid')}</p>
                )}
              </div>
            </button>
            <button
              type="button"
              onClick={() => setEditingKid(kid)}
              className="text-sm font-semibold text-primary"
            >
              {t('profile.edit')}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setAdding(true)}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-button border border-dashed border-primary/40 py-3 text-sm font-extrabold text-primary"
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} />
        {t('profile.addKid')}
      </button>

      {(adding || editingKid) && (
        <KidFormModal
          kid={editingKid}
          onClose={() => {
            setAdding(false);
            setEditingKid(null);
          }}
        />
      )}
    </section>
  );
}

interface KidFormModalProps {
  kid: KidProfile | null;
  onClose: () => void;
}

function KidFormModal({ kid, onClose }: KidFormModalProps) {
  const t = useT();
  const { user } = useAuth();
  const { kids } = useKids();
  const [name, setName] = useState(kid?.displayName ?? '');
  const [birthDate, setBirthDate] = useState(
    kid?.birthDate ? kid.birthDate.toDate().toISOString().slice(0, 10) : '',
  );
  const [icon, setIcon] = useState<string | undefined>(kid?.avatarIcon);
  const [color, setColor] = useState(kid?.avatarColor ?? '#7DD3C7');
  const [saving, setSaving] = useState(false);

  const isEdit = Boolean(kid);
  const canDelete = isEdit && kids.length > 1;

  const submit = async () => {
    if (!user || !name.trim() || !birthDate) return;
    setSaving(true);
    try {
      if (isEdit && kid) {
        await updateKid(user.uid, {
          id: kid.id,
          displayName: name.trim(),
          birthDate: new Date(birthDate),
          avatarColor: color,
          avatarIcon: icon ?? '',
        });
      } else {
        await addKid(user.uid, {
          displayName: name.trim(),
          birthDate: new Date(birthDate),
          avatarColor: color,
          avatarIcon: icon,
        });
      }
      onClose();
    } catch (err) {
      console.error('kid save failed', err);
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!user || !kid || !canDelete) return;
    if (!window.confirm(t('profile.deleteKidConfirm', { name: kid.displayName }))) return;
    setSaving(true);
    try {
      await removeKid(user.uid, kid.id);
      onClose();
    } catch (err) {
      console.error('kid delete failed', err);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-end justify-center bg-foreground/40 p-4 sm:items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        className="w-full max-w-md space-y-4 rounded-card bg-surface p-5 shadow-card"
      >
        <h4 className="text-lg font-extrabold">
          {isEdit ? t('profile.editKid') : t('profile.addKid')}
        </h4>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-foreground/60">
            {t('profile.kidName')}
          </span>
          <input
            type="text"
            required
            autoFocus={!isEdit}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-button border border-foreground/15 bg-cream px-3 py-2 text-base focus:border-primary focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-foreground/60">
            {t('profile.kidBirthDate')}
          </span>
          <input
            type="date"
            required
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full rounded-button border border-foreground/15 bg-cream px-3 py-2 text-base focus:border-primary focus:outline-none"
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
                    size={40}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 rounded-button border border-foreground/20 py-2 text-sm font-semibold disabled:opacity-50"
          >
            {t('diary.noteCancel')}
          </button>
          <button
            type="submit"
            disabled={saving || !name.trim() || !birthDate}
            className="flex-[2] rounded-button bg-accent py-2 text-sm font-extrabold text-foreground shadow-soft disabled:opacity-50"
          >
            {saving ? '...' : t('profile.save')}
          </button>
        </div>

        {canDelete && (
          <button
            type="button"
            onClick={onDelete}
            disabled={saving}
            className="inline-flex w-full items-center justify-center gap-2 rounded-button border border-coral/40 bg-coral/10 py-2 text-sm font-semibold text-coral disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            {t('profile.deleteKid')}
          </button>
        )}
      </form>
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

function ViewIntroLink() {
  const t = useT();
  const { activeKid } = useKids();
  const name = activeKid?.displayName?.trim() ?? '';
  const isBirthday = activeKid ? isBirthdayToday(activeKid) : false;
  return (
    <Link
      to="/intro"
      className={cn(
        'flex w-full items-center justify-center gap-2 rounded-button border-2 py-4 text-base font-extrabold transition-colors',
        isBirthday
          ? 'border-primary bg-highlight text-foreground shadow-card'
          : 'border-foreground/15 bg-cream text-foreground/80 hover:border-primary',
      )}
    >
      <Sparkles className="h-5 w-5" strokeWidth={2.5} />
      <span>
        {name
          ? t('profile.viewIntroNamed', { name })
          : t('profile.viewIntro')}
      </span>
      {isBirthday && (
        <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs font-extrabold uppercase tracking-wider text-foreground">
          {t('profile.viewIntroToday')}
        </span>
      )}
    </Link>
  );
}

function HelpLink() {
  const t = useT();
  return (
    <Link
      to="/ayuda"
      className="flex w-full items-center justify-center gap-2 rounded-button border border-foreground/15 bg-cream py-3 text-sm font-semibold text-foreground/80 transition-colors hover:border-primary"
    >
      <HelpCircle className="h-4 w-4" strokeWidth={2.5} />
      {t('profile.help')}
    </Link>
  );
}

function isBirthdayToday(kid: KidProfile): boolean {
  const birth = kid.birthDate?.toDate?.();
  if (!birth) return false;
  const today = new Date();
  return (
    birth.getMonth() === today.getMonth() &&
    birth.getDate() === today.getDate()
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
