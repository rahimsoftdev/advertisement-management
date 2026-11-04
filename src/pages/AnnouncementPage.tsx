import { useTranslation } from 'react-i18next';
import { getAuthInfo } from '../utils/auth';
import { useNavigate } from 'react-router';
import { useEffect, useRef, useState, type ChangeEvent, type DragEvent, type ReactNode } from 'react';
import {
  FiAlertTriangle, FiCheck, FiCheckCircle, FiChevronDown, FiChevronLeft, FiChevronRight,
  FiCopy, FiDownload, FiLock, FiMapPin, FiPlus, FiScissors, FiSun, FiTrendingUp,
  FiUpload, FiX, FiZap, FiHome, FiRefreshCw,
} from 'react-icons/fi';

/* ============================================================
   1. Types
   ============================================================ */
// NOTE: select/checkbox er value hishebe language-independent KEY save hoy (label na),
// tai language change korleo data thik thake.
type FormData = {
  emplacement: string; type: string; surface: string; pieces: string; etage: string; ascenseur: boolean;
  loyer: string; charge: string; chargeExclu: boolean; parking: string; prix: string;
  condition: string; exposition: string; equip: string[]; autres: string;
  dispo: string; animaux: string; proximite: string;
  images: string[]; infos: string;
};
type AiKey = 'premium' | 'warm' | 'short' | 'location' | 'investor' | 'airbnb';
// Ekta AI edit = (selected option?) + (custom prompt?)
type Edit = { key: AiKey | null; custom: string };
type Persisted = { data: FormData; step: number; phase: 'form' | 'result'; edits: Edit[]; unlocked: boolean; used: number };
type TFn = (k: string, o?: Record<string, unknown>) => string;

/* ============================================================
   2. Reusable constants (sob option / default ekhane)
   ============================================================ */
const STORAGE_KEY = 'casagen_announcement_v2';
const MAX_IMAGES = 15;
const MIN_IMAGES = 5;

const DEFAULT_DATA: FormData = {
  emplacement: '', type: 'appartement', surface: '', pieces: '', etage: '', ascenseur: true,
  loyer: '', charge: '', chargeExclu: false, parking: 'aucun', prix: '',
  condition: '', exposition: '', equip: [], autres: '',
  dispo: '', animaux: 'oui', proximite: '',
  images: [], infos: '',
};

// Select option keys (label gulo locale JSON e: options.<group>.<key>)
const OPTIONS = {
  type: ['appartement', 'maison', 'studio', 'villa', 'duplex', 'attique', 'local'],
  condition: ['neuf', 'renove', 'tres_bon', 'bon', 'a_renover'],
  exposition: ['nord', 'sud', 'est', 'ouest', 'sud_est', 'sud_ouest', 'traversant'],
  parking: ['aucun', 'exterieure', 'garage_ind', 'garage_col'],
  animaux: ['oui', 'non', 'demande'],
};
const EQUIPMENT_KEYS = ['colonne_lavage', 'cuisine_equipee', 'balcon', 'cave', 'jardin'];
const STEP_NAV_KEYS = ['general', 'finances', 'confort', 'conditions', 'medias'];
const AI_OPTIONS: { key: AiKey; i18n: string; icon: ReactNode }[] = [
  { key: 'premium', i18n: 'btn1', icon: <FiZap /> },
  { key: 'warm', i18n: 'btn2', icon: <FiSun /> },
  { key: 'short', i18n: 'btn3', icon: <FiScissors /> },
  { key: 'location', i18n: 'btn4', icon: <FiMapPin /> },
  { key: 'investor', i18n: 'btn5', icon: <FiTrendingUp /> },
  { key: 'airbnb', i18n: 'btn6', icon: <FiHome /> },
];

// Shared tailwind classes
const INPUT_CLS =
  'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-primaryText placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-myprimary';
const LABEL_CLS = 'mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-primaryText';
const HINT_CLS = 'mt-1 text-[10px] italic text-secondaryText';
const BTN_PRIMARY =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-myprimary px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40';
const BTN_GHOST =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-primaryText transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40';
// error hole lal border, na hole normal border
const border = (err: boolean) => (err ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-myprimary');

/* ============================================================
   3. Helper functions
   ============================================================ */
// Kon kon field khali ache (sob field required). Step bhitti kore list ferot dey.
function missing(step: number, d: FormData): string[] {
  const empty = (v: string) => v.trim() === '';
  const m: string[] = [];
  if (step === 1) (['emplacement', 'type', 'surface', 'pieces', 'etage'] as const).forEach((k) => empty(d[k]) && m.push(k));
  if (step === 2) (['loyer', 'charge', 'parking', 'prix'] as const).forEach((k) => empty(d[k]) && m.push(k));
  if (step === 3) {
    (['condition', 'exposition'] as const).forEach((k) => empty(d[k]) && m.push(k));
    if (d.equip.length === 0 && empty(d.autres)) m.push('equip'); // kom pokkhe ekta equipment ba "autres"
  }
  if (step === 4) (['dispo', 'animaux', 'proximite'] as const).forEach((k) => empty(d[k]) && m.push(k));
  if (step === 5) {
    if (d.images.length < MIN_IMAGES) m.push('images');
    if (empty(d.infos)) m.push('infos');
  }
  return m;
}
// Prothom je step e kisu baki ache (ta ber kora)
const firstInvalidStep = (d: FormData) => [1, 2, 3, 4, 5].find((s) => missing(s, d).length > 0) ?? 0;

// localStorage load (try/catch jate corrupted data e app crash na kore)
function loadSaved(): Persisted | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Persisted) : null;
  } catch { return null; }
}

// Image ke choto kore (max 700px) base64 e convert -> localStorage e rakha jay
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, 700 / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// Form data theke listing text toiri -- sob text current language (fr / en / bn) er JSON (listing.*) theke ashe
function buildListing(d: FormData, t: TFn): string {
  const type = t(`options.type.${d.type}`);
  const parts: string[] = [];
  parts.push(t('listing.title', { type, rooms: d.pieces, where: d.emplacement }));
  parts.push(`${t('listing.hook', { type: type.toLowerCase(), where: d.emplacement })} ${t('listing.exposure', { expo: t(`options.exposition.${d.exposition}`).toLowerCase() })}`);
  parts.push([
    t('listing.floor', { etage: d.etage }),
    t(d.ascenseur ? 'listing.elevator_yes' : 'listing.elevator_no'),
    t('listing.condition', { condition: t(`options.condition.${d.condition}`).toLowerCase() }),
  ].join(' '));
  parts.push(d.infos.trim());
  const eq = [...d.equip.map((k) => t(`steps.step3.${k}`)), ...d.autres.split(',').map((s) => s.trim()).filter(Boolean)];
  parts.push(t('listing.equip', { list: eq.join(', ') }));
  parts.push(t('listing.practical', {
    surface: d.surface, loyer: d.loyer, charge: d.charge, prix: d.prix,
    excl: d.chargeExclu ? t('listing.excl') : '',
    parking: t(`options.parking.${d.parking}`), animaux: t(`options.animaux.${d.animaux}`),
  }));
  parts.push(t('listing.proximity', { proximite: d.proximite }));
  parts.push(t('listing.availability', { dispo: d.dispo }));
  return parts.filter(Boolean).join('\n\n');
}

// Ekta AI edit text e apply kora (real API thakle ekhane call korben)
function applyAi(text: string, e: Edit, t: TFn): string {
  let out = text;
  if (e.key === 'premium') { const p = text.split('\n\n'); out = `${p[0]}\n\n${t('ai.premium')}\n\n${p.slice(1).join('\n\n')}`; }
  else if (e.key === 'short') { const p = text.split('\n\n'); out = p.filter((_, i) => i < 2 || i >= p.length - 3).join('\n\n'); }
  else if (e.key) out = `${text}\n\n${t(`ai.${e.key}`)}`;
  if (e.custom.trim()) out += `\n\n${e.custom.trim()}`; // user er nijer prompt
  return out;
}

// Quality % = kotogulo important field fill kora hoyeche
function computeQuality(d: FormData) {
  const checks = [d.emplacement, d.surface, d.pieces, d.etage, d.loyer, d.charge, d.condition, d.exposition,
    d.equip.length || d.autres, d.dispo, d.proximite, d.infos, d.images.length >= MIN_IMAGES ? 'ok' : ''];
  const pct = Math.round((checks.filter(Boolean).length / checks.length) * 100);
  // label = JSON key (preview.quality_level.<key>) -> language onujayi dekhabe
  return { pct, label: pct < 50 ? 'status' : pct < 80 ? 'status_good' : 'status_excellent' };
}

/* ============================================================
   4. Small reusable UI parts
   ============================================================ */
function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <div data-err={error ? 'true' : undefined}>
      <label className={LABEL_CLS}>{label}</label>
      {children}
      {error ? <p className="mt-1 text-[11px] text-red-500">{error}</p> : hint && <p className={HINT_CLS}>{hint}</p>}
    </div>
  );
}

function Select({ value, onChange, options, placeholder, error }: {
  value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string; error?: boolean;
}) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className={`${INPUT_CLS} ${border(!!error)} appearance-none pr-9 ${value === '' ? 'text-gray-400' : ''}`}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondaryText" />
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="flex items-center gap-2">
      <span className={`relative h-6 w-11 rounded-full transition ${checked ? 'bg-myprimary' : 'bg-gray-300'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
      </span>
      {label && <span className="text-xs text-primaryText">{label}</span>}
    </button>
  );
}

// Modal: background blur + body scroll lock + choto device e modal nijei scroll hoy
function Modal({ children, onClose, wide = false }: { children: ReactNode; onClose?: () => void; wide?: boolean }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; // baire scroll bondho
    return () => { document.body.style.overflow = prev; };
  }, []);
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="flex min-h-full items-center justify-center p-4">
        <div onClick={(e) => e.stopPropagation()}
          className={`w-full ${wide ? 'max-w-3xl' : 'max-w-md'} rounded-2xl bg-white p-5 shadow-xl sm:p-8`}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   5. Step fields (form + edit modal duitai ekhan theke render hoy)
   ============================================================ */
function StepFields({ step, d, set, t, showErr, onFiles, onRemoveImage }: {
  step: number; d: FormData;
  set: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  t: TFn; showErr: boolean;
  onFiles: (files: FileList | File[]) => void;
  onRemoveImage: (i: number) => void;
}) {
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const miss = missing(step, d);
  const p = (k: string) => t(`steps.step${step}.${k}`);
  const L = (k: string) => `${p(k)} *`; // sob field required -> * diye
  // Field er error message (shudhu submit try korar por dekhabe)
  const err = (f: string) => (showErr && miss.includes(f) ? t('validation.required') : undefined);
  const ic = (f: string) => `${INPUT_CLS} ${border(!!err(f))}`; // input class
  const opts = (g: keyof typeof OPTIONS) => OPTIONS[g].map((v) => ({ value: v, label: t(`options.${g}.${v}`) }));

  if (step === 1) return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label={L('emplacement_label')} hint={p('emplacement_hint')} error={err('emplacement')}>
        <input className={ic('emplacement')} value={d.emplacement} onChange={(e) => set('emplacement', e.target.value)} placeholder={p('emplacement_placeholder')} />
      </Field>
      <Field label={L('type_propriete_label')} error={err('type')}>
        <Select value={d.type} onChange={(v) => set('type', v)} options={opts('type')} error={!!err('type')} />
      </Field>
      <Field label={L('surface_label')} hint={p('surface_hint')} error={err('surface')}>
        <div className="relative">
          <input type="number" min="0" className={ic('surface')} value={d.surface} onChange={(e) => set('surface', e.target.value)} />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">M2</span>
        </div>
      </Field>
      <Field label={L('nombre_pieces_label')} hint={p('nombre_pieces_hint')} error={err('pieces')}>
        <input className={ic('pieces')} value={d.pieces} onChange={(e) => set('pieces', e.target.value)} placeholder={p('nombre_pieces_placeholder')} />
      </Field>
      <Field label={L('etage_label')} hint={p('etage_hint')} error={err('etage')}>
        <input className={ic('etage')} value={d.etage} onChange={(e) => set('etage', e.target.value)} />
      </Field>
      <Field label={p('ascenseur_label')}>
        <div className="pt-1"><Toggle checked={d.ascenseur} onChange={(v) => set('ascenseur', v)} /></div>
      </Field>
    </div>
  );

  if (step === 2) return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label={L('loyer_net_label')} error={err('loyer')}>
        <input type="number" min="0" className={ic('loyer')} value={d.loyer} onChange={(e) => set('loyer', e.target.value)} placeholder="CHF" />
      </Field>
      <Field label={L('charge_label')} error={err('charge')}>
        <input type="number" min="0" className={ic('charge')} value={d.charge} onChange={(e) => set('charge', e.target.value)} placeholder="CHF" />
        <div className="mt-2"><Toggle checked={d.chargeExclu} onChange={(v) => set('chargeExclu', v)} label={p('exclu_label')} /></div>
      </Field>
      <Field label={L('parking_label')} error={err('parking')}>
        <Select value={d.parking} onChange={(v) => set('parking', v)} options={opts('parking')} error={!!err('parking')} />
      </Field>
      <Field label={L('prix_label')} error={err('prix')}>
        <input type="number" min="0" className={ic('prix')} value={d.prix} onChange={(e) => set('prix', e.target.value)} placeholder="CHF" />
      </Field>
    </div>
  );

  if (step === 3) return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={L('condition_label')} error={err('condition')}>
          <Select value={d.condition} onChange={(v) => set('condition', v)} options={opts('condition')} placeholder={p('condition_placeholder')} error={!!err('condition')} />
        </Field>
        <Field label={L('exposition_label')} error={err('exposition')}>
          <Select value={d.exposition} onChange={(v) => set('exposition', v)} options={opts('exposition')} placeholder={p('exposition_placeholder')} error={!!err('exposition')} />
        </Field>
      </div>
      <Field label={L('equipement_title')} hint={p('equip_hint')} error={showErr && miss.includes('equip') ? t('validation.equip_min') : undefined}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {EQUIPMENT_KEYS.map((k) => {
            const on = d.equip.includes(k);
            return (
              <label key={k} className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm text-primaryText ${on ? 'border-myprimary bg-myprimary/5' : 'border-gray-200'}`}>
                <input type="checkbox" className="h-4 w-4 accent-[#3A7D6C]" checked={on}
                  onChange={() => set('equip', on ? d.equip.filter((x) => x !== k) : [...d.equip, k])} />
                {p(k)}
              </label>
            );
          })}
        </div>
        <input className={`${INPUT_CLS} ${border(false)} mt-3`} value={d.autres} onChange={(ev) => set('autres', ev.target.value)} placeholder={p('autres_placeholder')} />
      </Field>
    </div>
  );

  if (step === 4) return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={L('disponible_label')} error={err('dispo')}>
          <input className={ic('dispo')} value={d.dispo} onChange={(e) => set('dispo', e.target.value)} placeholder={p('disponible_placeholder')} />
        </Field>
        <Field label={L('animaux_label')} error={err('animaux')}>
          <Select value={d.animaux} onChange={(v) => set('animaux', v)} options={opts('animaux')} error={!!err('animaux')} />
        </Field>
      </div>
      <Field label={L('proximité_label')} error={err('proximite')}>
        <input className={ic('proximite')} value={d.proximite} onChange={(e) => set('proximite', e.target.value)} placeholder={p('proximité_placeholder')} />
      </Field>
    </div>
  );

  // step 5: image upload (drag & drop + preview) + extra info
  const imgErr = showErr && miss.includes('images');
  return (
    <div className="space-y-5">
      <div data-err={imgErr ? 'true' : undefined}>
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e: DragEvent) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e: DragEvent) => { e.preventDefault(); setDrag(false); onFiles(e.dataTransfer.files); }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${imgErr ? 'border-red-400' : drag ? 'border-myprimary bg-myprimary/5' : 'border-gray-200'}`}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-myprimary/10 text-myprimary"><FiUpload /></span>
          <p className="text-sm font-medium text-primaryText">{p('upload_title')} *</p>
          <p className="text-xs text-secondaryText">{p('upload_hint')}</p>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden
            onChange={(e: ChangeEvent<HTMLInputElement>) => { if (e.target.files) onFiles(e.target.files); e.target.value = ''; }} />
        </div>
        {imgErr && <p className="mt-1 text-[11px] text-red-500">{t('validation.images_min', { count: MIN_IMAGES })}</p>}
      </div>
      {/* Choto preview grid */}
      {d.images.length > 0 && (
        <div>
          <p className="mb-2 text-xs text-secondaryText">{d.images.length}/{MAX_IMAGES}</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {d.images.map((src, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-gray-200">
                <img src={src} alt={`preview ${i + 1}`} className="h-full w-full object-cover" />
                <button type="button" onClick={() => onRemoveImage(i)} aria-label="remove"
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white">
                  <FiX size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <Field label={L('info_comp_label')} error={err('infos')}>
        <textarea rows={4} className={ic('infos')} value={d.infos} onChange={(e) => set('infos', e.target.value)} placeholder={p('info_comp_placeholder')} />
      </Field>
    </div>
  );
}

/* ============================================================
   6. Main page
   ============================================================ */
export default function AnnouncementPage() {
  const { t: tr } = useTranslation('announcement');
  // Sob text current language (fr / en / bn) er JSON theke. escapeValue:false -> apostrophe thik thake
  const t: TFn = (k, o) => tr(k, { ...o, interpolation: { escapeValue: false } }) as string;

  const navigate = useNavigate();
  const userInfo = getAuthInfo();

  // Page load e localStorage theke data ferot ana (reload dileo step/data thake)
  const saved = useRef(loadSaved()).current;
  const [data, setData] = useState<FormData>(saved?.data ?? DEFAULT_DATA);
  const [step, setStep] = useState(saved?.step ?? 1);
  const [phase, setPhase] = useState<'form' | 'result'>(saved?.phase ?? 'form');
  const [edits, setEdits] = useState<Edit[]>(saved?.edits ?? []); // AI edit list (text language onujayi abar toiri hoy)
  const [unlocked, setUnlocked] = useState(saved?.unlocked ?? false);
  const [used, setUsed] = useState(saved?.used ?? 0); // koto credit kharoch hoyeche

  const credits = Math.max(0, Number(userInfo?.credit ?? 0) - used);
  const [showErr, setShowErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noCredit, setNoCredit] = useState(false);
  const [selected, setSelected] = useState<AiKey | null>(null); // select kora AI option (click e generate hoy na)
  const [prompt, setPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Modals
  const [submitModal, setSubmitModal] = useState<null | 'review' | 'confirm' | 'success'>(null);
  const [editModal, setEditModal] = useState<null | 'edit' | 'success'>(null);
  const [newModal, setNewModal] = useState(false);
  const [draft, setDraft] = useState<FormData>(data);
  const [editStep, setEditStep] = useState(1);
  const [editShowErr, setEditShowErr] = useState(false);

  // Login na thakle redirect
  useEffect(() => { if (!userInfo) navigate('/login'); }, [userInfo, navigate]);

  // Prottek change e localStorage e save
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, step, phase, edits, unlocked, used })); }
    catch { /* storage full hole ignore */ }
  }, [data, step, phase, edits, unlocked, used]);

  // Step change hole upore scroll + error reset
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setShowErr(false); }, [step, phase]);

  if (!userInfo) return null;

  // Listing text: form data + AI edit gulo diye prottekbar current language e toiri (language change hole text o change hoy)
  const text = edits.reduce((acc, e) => applyAi(acc, e, t), buildListing(data, t));

  /* ---------- handlers ---------- */
  const setField = <K extends keyof FormData>(k: K, v: FormData[K]) => setData((p) => ({ ...p, [k]: v }));
  const setDraftField = <K extends keyof FormData>(k: K, v: FormData[K]) => setDraft((p) => ({ ...p, [k]: v }));

  // Image add (max 15, compress kore)
  const addImages = async (files: FileList | File[], target: 'data' | 'draft') => {
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
    const current = target === 'data' ? data.images : draft.images;
    const room = list.slice(0, MAX_IMAGES - current.length);
    const urls = await Promise.all(room.map((f) => compressImage(f).catch(() => '')));
    const clean = urls.filter(Boolean);
    if (target === 'data') setData((p) => ({ ...p, images: [...p.images, ...clean] }));
    else setDraft((p) => ({ ...p, images: [...p.images, ...clean] }));
  };

  // NEW: sob data muche notun kore shuru (form + AI edit + unlock sob reset)
  const resetAll = () => {
    setData(DEFAULT_DATA); setStep(1); setPhase('form'); setEdits([]); setUnlocked(false);
    setSelected(null); setPrompt(''); setNoCredit(false); setShowErr(false);
    setSubmitModal(null); setEditModal(null); setNewModal(false);
  };

  // Final submit: result phase e jawa
  const finishSubmit = () => { setEdits([]); setPhase('result'); setSubmitModal(null); };

  // Edit modal save: kono step e khali thakle oi step e niye jabe
  const saveEdit = () => {
    const bad = firstInvalidStep(draft);
    if (bad) { setEditStep(bad); setEditShowErr(true); return; }
    setData(draft);
    setEditShowErr(false);
    setEditModal('success');
  };

  // AI option select (shudhu select hoy, generate hoy na)
  const selectAi = (key: AiKey) => { setSelected((s) => (s === key ? null : key)); setNoCredit(false); };

  // Generate button click: tokhon ei AI chalu hobe
  const generate = () => {
    if (loading) return;
    if (credits <= 0) { setNoCredit(true); return; } // credit nai
    if (!selected && !prompt.trim()) return;           // option ba prompt kisu lagbe
    setNoCredit(false);
    setLoading(true);
    setTimeout(() => {
      setEdits((p) => [...p, { key: selected, custom: prompt.trim() }]);
      setUsed((u) => u + 1);
      setLoading(false);
      setSelected(null);
      setPrompt('');
    }, 2000);
  };

  const copyText = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* ignore */ }
  };

  // PDF: print window khule browser er "Save as PDF" use
  const downloadPdf = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    const safe = text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    w.document.write(`<pre style="font-family:sans-serif;white-space:pre-wrap;padding:24px;line-height:1.6">${safe}</pre>`);
    w.document.close();
    w.print();
  };

  const quality = computeQuality(data);
  const suggestions = [1, 2, 3, 4].map((n) => t(`preview.quality_level.sug${n}`));

  /* ---------- Stepper (top progress) ---------- */
  const Stepper = (
    <div className="bg-white py-4">
      <div className="px-4 lg:px-10">
        <div className="mx-auto flex max-w-3xl items-start">
          {STEP_NAV_KEYS.map((k, i) => {
            const n = i + 1;
            const done = n < step;
            const active = n === step;
            return (
              <div key={k} className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  <div className={`h-px flex-1 ${i === 0 ? 'bg-transparent' : done || active ? 'bg-myprimary' : 'bg-gray-200'}`} />
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${done || active ? 'border-myprimary bg-myprimary text-white' : 'border-gray-300 bg-white text-secondaryText'}`}>
                    {done ? <FiCheck /> : n}
                  </span>
                  <div className={`h-px flex-1 ${i === STEP_NAV_KEYS.length - 1 ? 'bg-transparent' : done ? 'bg-myprimary' : 'bg-gray-200'}`} />
                </div>
                <span className={`mt-1 text-[9px] font-medium uppercase sm:text-[10px] ${active || done ? 'text-myprimary' : 'text-secondaryText'}`}>
                  {t(`steps_nav.${k}`)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  /* ============================================================
     RESULT (preview) phase
     ============================================================ */
  if (phase === 'result') {
    return (
      <div className="min-h-screen bg-[#F9F8F6] py-10 sm:py-12 lg:py-section">
        <div className="px-4 lg:px-10">
          {/* Header card */}
          <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primaryText">{t('preview.ready_title')}</h1>
              <p className="text-sm text-secondaryText">{t('preview.ready_subtitle')}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {/* NEW button: sob data muche notun upload */}
              <button className={BTN_GHOST} onClick={() => setNewModal(true)}><FiRefreshCw />{t('new.btn')}</button>
              <button className={BTN_GHOST} onClick={() => { setDraft(data); setEditStep(1); setEditShowErr(false); setEditModal('edit'); }}>{t('preview.modifier_btn')}</button>
              {!unlocked && <button className={BTN_PRIMARY} onClick={() => setUnlocked(true)}>{t('preview.unlock_full_btn')}</button>}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* LEFT: preview text */}
            <div>
              <div className="relative min-h-[420px] rounded-2xl bg-white p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase text-secondaryText">{t('preview.apercu_label')}</span>
                  <span className="rounded bg-myprimary/10 px-2 py-1 text-[10px] font-medium text-myprimary">{t('preview.lang_badge')}</span>
                </div>

                {loading ? (
                  // Sundor loading
                  <div className="flex min-h-[320px] flex-col items-center justify-center gap-3">
                    <div className="flex gap-2">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="h-3 w-3 animate-bounce rounded-full bg-myprimary" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                    <p className="text-xs font-medium uppercase tracking-[0.25em] text-myprimary">{t('preview.loading')}</p>
                  </div>
                ) : noCredit ? (
                  // Credit nai card -> /pricing#credits
                  <div className="flex min-h-[320px] items-center justify-center">
                    <div className="w-full max-w-xs rounded-2xl border border-gray-100 bg-white p-4 shadow-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[10px] uppercase text-secondaryText">{t('preview.your_credits')}</p>
                          <p className="text-lg font-semibold text-primaryText">{t('preview.no_credits.title')}</p>
                        </div>
                        <button onClick={() => navigate('/pricing#credits')} className="rounded bg-myprimary/10 p-1 text-myprimary" aria-label="add credits"><FiPlus /></button>
                      </div>
                      <div className="mt-3 rounded-xl bg-red-50 p-4 text-center">
                        <FiAlertTriangle className="mx-auto mb-2 text-red-500" />
                        <p className="text-sm font-semibold text-red-600">{t('preview.no_credits.warning_title')}</p>
                        <p className="mb-3 mt-1 text-[11px] text-red-400">{t('preview.no_credits.warning_desc')}</p>
                        <button onClick={() => navigate('/pricing#credits')} className="w-full rounded-md bg-red-600 py-2 text-xs font-medium text-white hover:bg-red-700">
                          {t('preview.no_credits.btn')}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className={`whitespace-pre-line text-xs leading-relaxed text-primaryText sm:text-sm ${!unlocked ? 'select-none blur-sm' : ''}`}>
                    {text}
                  </p>
                )}

                {/* Unlock modal-card (9.90 CHF) */}
                {!unlocked && !loading && !noCredit && (
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="w-full max-w-xs rounded-2xl bg-white p-6 text-center shadow-xl">
                      <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-myprimary/10 text-myprimary"><FiLock /></span>
                      <h3 className="font-semibold text-primaryText">{t('preview.modal.title')}</h3>
                      <p className="my-3 text-xs text-secondaryText">{t('preview.modal.description')}</p>
                      <button className={`${BTN_PRIMARY} w-full`} onClick={() => setUnlocked(true)}>{t('preview.modal.pay_btn')}</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <button className={BTN_GHOST} onClick={copyText} disabled={!unlocked}><FiCopy />{copied ? t('preview.copied') : t('preview.copy_btn')}</button>
                <button className={BTN_GHOST} onClick={downloadPdf} disabled={!unlocked}><FiDownload />{t('preview.download_pdf_btn')}</button>
              </div>
            </div>

            {/* RIGHT: sidebar */}
            <aside className="space-y-4">
              {!unlocked ? (
                // Lock thakle quality card dekhabe
                <div className="rounded-2xl bg-white p-5">
                  <h3 className="mb-3 font-semibold text-primaryText">{t('preview.quality_level.title')}</h3>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="rounded bg-myprimary/10 px-2 py-0.5 font-medium text-myprimary">{t(`preview.quality_level.${quality.label}`)}</span>
                    <span className="text-secondaryText">{quality.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-200"><div className="h-full rounded-full bg-myprimary" style={{ width: `${quality.pct}%` }} /></div>
                  <p className="mb-2 mt-4 text-[11px] uppercase text-secondaryText">{t('preview.quality_level.suggestions_title')}</p>
                  <ul className="space-y-2 text-xs text-secondaryText">
                    {suggestions.map((s) => <li key={s}>• {s}</li>)}
                  </ul>
                </div>
              ) : (
                <div className="rounded-2xl bg-white p-5">
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-primaryText">{t('preview.ai_options.title')}</h3>
                    <span className="rounded-full bg-myprimary/10 px-2 py-0.5 text-[10px] text-myprimary">{credits} {t('preview.ai_options.credits_tag')}</span>
                  </div>
                  <p className="text-[10px] text-secondaryText">{t('preview.ai_options.note')}</p>
                  <div className="my-3 space-y-2">
                    {AI_OPTIONS.map((o) => (
                      <button key={o.key} type="button" onClick={() => selectAi(o.key)} disabled={loading}
                        className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-xs text-primaryText transition hover:border-myprimary ${selected === o.key ? 'border-myprimary bg-myprimary/10' : 'border-gray-200'}`}>
                        <span className="text-secondaryText">{o.icon}</span>
                        <span className="flex-1">{t(`preview.ai_options.${o.i18n}`)}</span>
                        <span className="text-[10px] text-gray-400">{t('preview.cost_tag')}</span>
                      </button>
                    ))}
                  </div>
                  <label className="mb-1 block text-xs font-semibold text-primaryText">{t('preview.generate_with_ai')}</label>
                  <textarea rows={3} value={prompt} onChange={(e) => { setPrompt(e.target.value); setNoCredit(false); }} placeholder={t('preview.ai_options.generate_placeholder')} className={`${INPUT_CLS} ${border(false)} text-xs`} />
                  {/* Generate: option select ba prompt thakle (ba credit 0 hole error card dekhate) */}
                  <button className={`${BTN_PRIMARY} mt-2 w-full`} disabled={loading || (credits > 0 && !selected && !prompt.trim())} onClick={generate}>
                    {t('preview.ai_options.generate_btn')}
                  </button>
                </div>
              )}

              <div className="rounded-2xl bg-myprimary p-5 text-white">
                <h3 className="font-semibold">{t('preview.expert_validation.title')}</h3>
                <p className="my-2 text-[11px] opacity-90">{t('preview.expert_validation.description')}</p>
                <button className="w-full rounded-lg bg-white py-2 text-xs font-medium text-myprimary">{t('preview.expert_validation.btn')}</button>
              </div>
            </aside>
          </div>

          {/* NEW button (niche-o): notun kore shuru */}
          <div className="mt-8 flex justify-center">
            <button className={BTN_PRIMARY} onClick={() => setNewModal(true)}><FiRefreshCw />{t('new.btn')}</button>
          </div>
        </div>

        {/* ---------- NEW confirm modal ---------- */}
        {newModal && (
          <Modal onClose={() => setNewModal(false)}>
            <div className="text-center">
              <FiAlertTriangle className="mx-auto mb-3 text-4xl text-myprimary" />
              <h2 className="text-lg font-semibold text-primaryText">{t('new.title')}</h2>
              <p className="my-3 text-sm text-secondaryText">{t('new.desc')}</p>
              <div className="flex flex-col-reverse justify-center gap-3 sm:flex-row">
                <button className={BTN_GHOST} onClick={() => setNewModal(false)}>{t('navigation.annuler')}</button>
                <button className={BTN_PRIMARY} onClick={resetAll}>{t('new.confirm')}</button>
              </div>
            </div>
          </Modal>
        )}

        {/* ---------- EDIT MODAL: sob field abar dekhabe ---------- */}
        {editModal && (
          <Modal wide onClose={() => editModal === 'success' && setEditModal(null)}>
            {editModal === 'edit' ? (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-primaryText">{t('preview.modifier_btn')}</h2>
                  <button onClick={() => setEditModal(null)} aria-label="close"><FiX /></button>
                </div>
                {/* Step tabs (kono step e kisu baki thakle lal dot) */}
                <div className="mb-5 flex gap-1 overflow-x-auto">
                  {STEP_NAV_KEYS.map((k, i) => (
                    <button key={k} onClick={() => setEditStep(i + 1)}
                      className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-medium ${editStep === i + 1 ? 'bg-myprimary text-white' : 'bg-gray-100 text-secondaryText'}`}>
                      {t(`steps_nav.${k}`)}{editShowErr && missing(i + 1, draft).length > 0 && <span className="ml-1 text-red-500">●</span>}
                    </button>
                  ))}
                </div>
                <StepFields step={editStep} d={draft} set={setDraftField} t={t} showErr={editShowErr}
                  onFiles={(f) => addImages(f, 'draft')} onRemoveImage={(i) => setDraft((p) => ({ ...p, images: p.images.filter((_, x) => x !== i) }))} />
                <div className="mt-6 flex justify-end gap-3">
                  <button className={BTN_GHOST} onClick={() => setEditModal(null)}>{t('navigation.annuler')}</button>
                  <button className={BTN_PRIMARY} onClick={saveEdit}>{t('edit.save')}</button>
                </div>
              </>
            ) : (
              <div className="py-4 text-center">
                <FiCheckCircle className="mx-auto mb-3 text-5xl text-myprimary" />
                <h2 className="text-lg font-semibold text-primaryText">{t('edit.success_title')}</h2>
                <p className="mb-5 mt-1 text-sm text-secondaryText">{t('edit.success_desc')}</p>
                <button className={BTN_PRIMARY} onClick={() => setEditModal(null)}>{t('edit.close')}</button>
              </div>
            )}
          </Modal>
        )}
      </div>
    );
  }

  /* ============================================================
     FORM phase (step 1..5)
     ============================================================ */
  // Next click: kisu khali thakle error dekhabe + oi field e scroll; sob thik hole next step / submit modal
  const onNext = () => {
    if (missing(step, data).length > 0) {
      setShowErr(true);
      setTimeout(() => formRef.current?.querySelector('[data-err="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
      return;
    }
    if (step < 5) setStep(step + 1);
    else setSubmitModal('review');
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      {Stepper}

      <section className="pb-10 sm:pb-12 lg:pb-section pt-12 sm:pt-12">
        <div className="px-4 lg:px-10">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold text-primaryText">{t('header.title')}</h1>
            <p className="mb-6 mt-2 max-w-md text-sm text-secondaryText">{t('header.subtitle')}</p>

            <form ref={formRef} noValidate onSubmit={(e) => { e.preventDefault(); onNext(); }} className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">
              <h2 className="mb-6 text-base font-semibold text-primaryText">{t(`steps.step${step}.title`)}</h2>

              <StepFields step={step} d={data} set={setField} t={t} showErr={showErr}
                onFiles={(f) => addImages(f, 'data')} onRemoveImage={(i) => setData((p) => ({ ...p, images: p.images.filter((_, x) => x !== i) }))} />

              {step === 1 && <p className="mt-6 text-center text-[10px] italic text-secondaryText">{t('steps.step1.basic_note')}</p>}

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between">
                {step === 1 ? (
                  <button type="button" onClick={resetAll} className="flex items-center gap-2 text-sm text-primaryText"><FiChevronLeft />{t('navigation.annuler')}</button>
                ) : (
                  <button type="button" onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-sm uppercase text-primaryText"><FiChevronLeft />{t('navigation.retour')}</button>
                )}
                <button type="submit" className={BTN_PRIMARY}>
                  {t('navigation.etape_suivante')}<FiChevronRight />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ---------- SUBMIT MODAL: review -> confirm -> success ---------- */}
      {submitModal && (
        <Modal onClose={submitModal === 'success' ? finishSubmit : () => setSubmitModal(null)}>
          {submitModal === 'review' && (
            <>
              <h2 className="text-lg font-semibold text-primaryText">{t('submit.title')}</h2>
              <ul className="my-4 space-y-1 text-sm text-secondaryText">
                <li><b className="text-primaryText">{t(`options.type.${data.type}`)}</b> – {data.emplacement}</li>
                <li>{data.surface} m² · {data.pieces} {t('submit.rooms')} · CHF {data.loyer}</li>
                <li>{t(`options.condition.${data.condition}`)} · {t(`options.exposition.${data.exposition}`)}</li>
                <li>{data.images.length} {t('submit.photos')}</li>
              </ul>
              <div className="flex justify-end gap-3">
                <button className={BTN_GHOST} onClick={() => setSubmitModal(null)}>{t('navigation.retour')}</button>
                <button className={BTN_PRIMARY} onClick={() => setSubmitModal('confirm')}>{t('submit.btn')}</button>
              </div>
            </>
          )}
          {submitModal === 'confirm' && (
            <div className="text-center">
              <FiAlertTriangle className="mx-auto mb-3 text-4xl text-myprimary" />
              <h2 className="text-lg font-semibold text-primaryText">{t('submit.confirm_title')}</h2>
              <p className="my-3 text-sm text-secondaryText">{t('submit.confirm_desc')}</p>
              <div className="flex justify-center gap-3">
                <button className={BTN_GHOST} onClick={() => setSubmitModal('review')}>{t('navigation.annuler')}</button>
                <button className={BTN_PRIMARY} onClick={() => setSubmitModal('success')}>{t('submit.confirm_btn')}</button>
              </div>
            </div>
          )}
          {submitModal === 'success' && (
            <div className="text-center">
              <FiCheckCircle className="mx-auto mb-3 text-5xl text-myprimary" />
              <h2 className="text-lg font-semibold text-primaryText">{t('submit.success_title')}</h2>
              <p className="my-3 text-sm text-secondaryText">{t('submit.success_desc')}</p>
              <button className={BTN_PRIMARY} onClick={finishSubmit}>{t('submit.see_preview')}</button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}