import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  FiActivity,
  FiAlertTriangle,
  FiCreditCard,
  FiFileText,
  FiLogOut,
  FiPlus,
  FiSearch,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import { getAuthInfo } from '../utils/auth';
// Path ta tomar project onujayi thik koro
import PricingCard from '../components/ui/PricingCard';

/* ────────────────────────────────────────────────────────────
   Types
──────────────────────────────────────────────────────────── */
type Tab = 'listings' | 'pricing';
type PackageKey = 'individual' | 'essential' | 'premium';

interface Member {
  id: number;
  name?: string; // name na thakle "Utilisateur" dekhabe
  email: string;
  isPaid: boolean;
  listings: number;
}

interface PipelineItem {
  id: number;
  name?: string;
  email: string;
  status: 'pending' | 'live';
}

interface PackageRequest {
  id: number;
  name?: string;
  email: string;
  status: 'pending' | 'paid';
  pkg: PackageKey;
  listingLimit: number;
  granted: boolean;
}

interface PlanData {
  id: string;
  name: string;
  description: string;
  tagline: string;
  credits: number;
  price: number;
  features: string[];
  isPopular: boolean;
}

/* ────────────────────────────────────────────────────────────
   Mock data (API ashle eigulo replace koro)
──────────────────────────────────────────────────────────── */
const TOTAL_MEMBERS = 1248;
const PAID_USERS = 382;

const INITIAL_MEMBERS: Member[] = [
  { id: 1, email: 'admin@admin.com', isPaid: false, listings: 0 },
  { id: 2, name: 'Marc Dupont', email: 'm.dupont@swisscom.ch', isPaid: true, listings: 4 },
  { id: 3, name: 'Elena Meyer', email: 'elena@zucrich.ch', isPaid: false, listings: 0 },
  { id: 4, name: 'Stefan K.', email: 'sophie.k@gmail.com', isPaid: true, listings: 2 },
  { id: 5, name: 'Sophie L.', email: 'sophie.l@cpfl.ch', isPaid: false, listings: 1 },
  { id: 6, name: 'Thomas R.', email: 't.reynold@bluewin.ch', isPaid: false, listings: 1 },
];

const INITIAL_PIPELINE: PipelineItem[] = [
  { id: 1, email: 'admin@admin.com', status: 'pending' },
  { id: 2, name: 'Marc Dupont', email: 'm.dupont@swisscom.ch', status: 'pending' },
  { id: 3, name: 'Elena Meyer', email: 'elena@zucrich.ch', status: 'pending' },
  { id: 4, name: 'Stefan K.', email: 'sophie.k@gmail.com', status: 'live' },
];

const INITIAL_REQUESTS: PackageRequest[] = [
  { id: 1, email: 'admin@admin.com', status: 'pending', pkg: 'individual', listingLimit: 3, granted: false },
  { id: 2, name: 'Marc Dupont', email: 'm.dupont@swisscom.ch', status: 'paid', pkg: 'essential', listingLimit: 7, granted: false },
  { id: 3, name: 'Elena Meyer', email: 'elena@zucrich.ch', status: 'pending', pkg: 'essential', listingLimit: 7, granted: false },
  { id: 4, name: 'Stefan K.', email: 'sophie.k@gmail.com', status: 'paid', pkg: 'individual', listingLimit: 3, granted: false },
  { id: 5, name: 'Sophie L.', email: 'sophie.l@cpfl.ch', status: 'pending', pkg: 'premium', listingLimit: 15, granted: false },
  { id: 6, name: 'Thomas R.', email: 't.reynold@bluewin.ch', status: 'pending', pkg: 'individual', listingLimit: 3, granted: false },
];

// Text gulo JSON (pricing.plans.<key>) theke ashe, number gulo ekhane
const PLAN_DEFAULTS = [
  { key: 'mini', credits: 3, price: 1.5, isPopular: false },
  { key: 'starter', credits: 7, price: 3.15, isPopular: false },
  { key: 'pro', credits: 15, price: 6, isPopular: true },
] as const;

/* ────────────────────────────────────────────────────────────
   Small helpers & shared styles
──────────────────────────────────────────────────────────── */
const matches = (query: string, ...fields: (string | undefined)[]) => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return fields.some((f) => f?.toLowerCase().includes(q));
};

const btnPrimary =
  'px-3 py-1.5 text-xs font-semibold rounded-full bg-[#3A7D6C] text-white hover:bg-[#2f6658] transition-all duration-200 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed';
const btnOutline =
  'px-3 py-1.5 text-xs font-semibold rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all duration-200 cursor-pointer whitespace-nowrap';
const inputClass =
  'w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3A7D6C]/30 focus:border-[#3A7D6C] read-only:bg-slate-50 read-only:text-slate-500';
const thClass =
  'px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap';
const tdClass = 'px-4 py-3 align-middle';

const StatusBadge: React.FC<{ tone: 'pending' | 'paid' | 'live'; children: React.ReactNode }> = ({
  tone,
  children,
}) => {
  const styles = {
    pending: 'bg-orange-50 text-orange-600',
    paid: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    live: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  }[tone];
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide whitespace-nowrap ${styles}`}>
      {children}
    </span>
  );
};

const Identity: React.FC<{ name: string; email: string }> = ({ name, email }) => (
  <div className="min-w-0">
    <p className="text-sm font-semibold text-slate-900 truncate">{name}</p>
    <p className="text-[11px] text-slate-400 truncate">{email}</p>
  </div>
);

const SearchBox: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}> = ({ value, onChange, placeholder }) => (
  <div className="relative w-full sm:w-64">
    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className={`${inputClass} pl-9`}
    />
  </div>
);

const StatCard: React.FC<{
  icon: React.ReactNode;
  tone: string;
  label: string;
  value: string;
}> = ({ icon, tone, label, value }) => (
  <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tone}`}>{icon}</div>
    <div>
      <p className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">{label}</p>
      <h3 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">{value}</h3>
    </div>
  </div>
);

const TableCard: React.FC<{
  title: string;
  subtitle: string;
  search: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, subtitle, search, children }) => (
  <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 sm:p-6">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">{title}</h2>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </div>
      {search}
    </div>
    <div className="overflow-x-auto border-t border-slate-100">{children}</div>
  </section>
);

/* ────────────────────────────────────────────────────────────
   Modal shell: background blur + body scroll lock + ESC + overlay click
──────────────────────────────────────────────────────────── */
const Modal: React.FC<{
  onClose: () => void;
  labelledBy: string;
  children: React.ReactNode;
}> = ({ onClose, labelledBy, children }) => {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    // scrollbar gayeb hole layout jhaka na khay
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overscroll-contain"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto overscroll-contain rounded-2xl bg-white shadow-2xl"
      >
        {children}
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
   Edit / Create plan modal
──────────────────────────────────────────────────────────── */
const EditPlanModal: React.FC<{
  plan: PlanData;
  isNew: boolean;
  onSave: (plan: PlanData) => void;
  onClose: () => void;
}> = ({ plan, isNew, onSave, onClose }) => {
  const { t } = useTranslation('admindashboard');
  const [form, setForm] = useState({
    name: plan.name,
    isPopular: plan.isPopular,
    credits: plan.credits ? String(plan.credits) : '',
    price: isNew ? '' : String(plan.price),
    tagline: plan.tagline,
    features: plan.features,
  });
  const [newFeature, setNewFeature] = useState('');

  const creditsNum = Number(form.credits);
  const priceNum = Number(form.price);
  const perCredit = creditsNum > 0 ? (priceNum / creditsNum).toFixed(2) : '0.00';
  const isValid =
    form.name.trim() !== '' && creditsNum >= 1 && form.price !== '' && priceNum >= 0;

  const addFeature = () => {
    const value = newFeature.trim();
    if (!value) return;
    setForm((f) => ({ ...f, features: [...f.features, value] }));
    setNewFeature('');
  };

  const updateFeature = (index: number, value: string) =>
    setForm((f) => ({
      ...f,
      features: f.features.map((item, i) => (i === index ? value : item)),
    }));

  const removeFeature = (index: number) =>
    setForm((f) => ({ ...f, features: f.features.filter((_, i) => i !== index) }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onSave({
      id: plan.id,
      name: form.name.trim(),
      description: plan.description,
      tagline: form.tagline.trim(),
      credits: Math.round(creditsNum),
      price: priceNum,
      features: form.features.map((f) => f.trim()).filter(Boolean),
      isPopular: form.isPopular,
    });
  };

  const labelClass = 'block text-xs font-semibold text-slate-700 mb-1.5';

  return (
    <Modal onClose={onClose} labelledBy="edit-plan-title">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 pb-3">
          <div>
            <h3 id="edit-plan-title" className="text-lg font-bold text-slate-900">
              {isNew
                ? t('pricing.addPackage')
                : t('editPlanModal.title', { name: plan.name })}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{t('editPlanModal.subtitle')}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.cancel')}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="px-5 sm:px-6 pb-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="plan-name">{t('editPlanModal.planName')}</label>
              <input
                id="plan-name"
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="plan-popular">{t('editPlanModal.popularBadge')}</label>
              <select
                id="plan-popular"
                className={inputClass}
                value={form.isPopular ? 'yes' : 'no'}
                onChange={(e) => setForm((f) => ({ ...f, isPopular: e.target.value === 'yes' }))}
              >
                <option value="yes">{t('editPlanModal.yes')}</option>
                <option value="no">{t('editPlanModal.no')}</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="plan-credits">{t('editPlanModal.credits')}</label>
              <input
                id="plan-credits"
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                className={inputClass}
                value={form.credits}
                onChange={(e) => setForm((f) => ({ ...f, credits: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="plan-price">{t('editPlanModal.price')} (CHF)</label>
              <input
                id="plan-price"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                className={inputClass}
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="plan-usage">{t('editPlanModal.creditUsage')}</label>
            <input
              id="plan-usage"
              className={inputClass}
              readOnly
              value={t('editPlanModal.creditUsagePlaceholder', { price: perCredit })}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="plan-quote">{t('editPlanModal.quote')}</label>
            <input
              id="plan-quote"
              className={inputClass}
              value={form.tagline}
              onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
            />
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
              {t('editPlanModal.features')}
            </p>
            <div className="space-y-2">
              {form.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    className={inputClass}
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    aria-label="Remove"
                    className="shrink-0 p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition cursor-pointer"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-2">
                <input
                  className={inputClass}
                  value={newFeature}
                  placeholder={t('editPlanModal.addFeaturePlaceholder')}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addFeature}
                  aria-label={t('pricing.addPackage')}
                  className="shrink-0 p-2.5 rounded-lg bg-[#3A7D6C] text-white hover:bg-[#2f6658] transition cursor-pointer"
                >
                  <FiPlus size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 px-5 sm:px-6 py-4 bg-white border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            {t('editPlanModal.cancel')}
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className="px-5 py-2.5 text-sm font-medium rounded-lg bg-[#3A7D6C] text-white hover:bg-[#2f6658] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('editPlanModal.save')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

/* ────────────────────────────────────────────────────────────
   Grant package modal
──────────────────────────────────────────────────────────── */
const GrantModal: React.FC<{
  request: PackageRequest;
  userName: string;
  onConfirm: () => void;
  onClose: () => void;
}> = ({ request, userName, onConfirm, onClose }) => {
  const { t } = useTranslation('admindashboard');

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: t('grantModal.username'), value: userName },
    { label: t('grantModal.requestedPlan'), value: t(`requests.packages.${request.pkg}`) },
    {
      label: t('grantModal.paymentStatus'),
      value: (
        <StatusBadge tone={request.status}>
          {request.status === 'paid' ? t('common.paid') : t('common.pending')}
        </StatusBadge>
      ),
    },
    {
      label: t('grantModal.listingLimit'),
      value: t('grantModal.listingsValue', { count: request.listingLimit }),
    },
  ];

  return (
    <Modal onClose={onClose} labelledBy="grant-title">
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 shrink-0 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
              <FiAlertTriangle size={18} />
            </span>
            <h3 id="grant-title" className="text-lg font-bold text-slate-900">
              {t('grantModal.title')}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.cancel')}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        <p className="text-sm text-slate-600">{t('grantModal.question')}</p>

        <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs leading-relaxed">
          <FiAlertTriangle className="shrink-0 mt-0.5" size={14} />
          <p>{t('grantModal.warning')}</p>
        </div>

        <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-3">
            {t('grantModal.detailsTitle')}
          </p>
          <dl className="space-y-3">
            {rows.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
                <dt className="text-slate-500">{row.label}</dt>
                <dd className="font-semibold text-slate-900 text-right">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            {t('grantModal.cancel')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 text-sm font-medium rounded-lg bg-[#3A7D6C] text-white hover:bg-[#2f6658] transition cursor-pointer"
          >
            {t('grantModal.confirm')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

/* ────────────────────────────────────────────────────────────
   Page
──────────────────────────────────────────────────────────── */
export default function AdminDashboardPage() {
  const { t, i18n } = useTranslation('admindashboard');
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(getAuthInfo());

  const [activeTab, setActiveTab] = useState<Tab>('listings');

  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [pipeline, setPipeline] = useState<PipelineItem[]>(INITIAL_PIPELINE);
  const [requests, setRequests] = useState<PackageRequest[]>(INITIAL_REQUESTS);

  const [memberQuery, setMemberQuery] = useState('');
  const [pipelineQuery, setPipelineQuery] = useState('');
  const [requestQuery, setRequestQuery] = useState('');

  const [overrides, setOverrides] = useState<Record<string, PlanData>>({});
  const [extraPlans, setExtraPlans] = useState<PlanData[]>([]);
  const [editing, setEditing] = useState<{ plan: PlanData; isNew: boolean } | null>(null);
  const [granting, setGranting] = useState<PackageRequest | null>(null);

  // Login na thakle access nai
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
    if(userInfo?.role !== 'admin'){
        navigate('/login');
    }
  }, [userInfo, navigate]);

  const handleLogout = () => {
    try {
      localStorage.removeItem('authInfo');
    } catch {
      // localStorage access na pele ignore
    }
    setUserInfo(null);
    navigate('/login');
  };

  const nameOf = (name?: string) => name ?? t('approvalPipeline.user');

  const today = new Intl.DateTimeFormat(i18n.language, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const formattedTotal = TOTAL_MEMBERS.toLocaleString(i18n.language);

  /* ── Plans (text language onujayi, edit korle override) ── */
  const defaultPlans = useMemo<PlanData[]>(
    () =>
      PLAN_DEFAULTS.map((p) => ({
        id: p.key,
        name: t(`pricing.plans.${p.key}.name`),
        description: t(`pricing.plans.${p.key}.description`),
        tagline: t(`pricing.plans.${p.key}.tagline`),
        credits: p.credits,
        price: p.price,
        features: t(`pricing.plans.${p.key}.features`, { returnObjects: true }) as string[],
        isPopular: p.isPopular,
      })),
    [t],
  );

  const plans = useMemo(
    () => [...defaultPlans, ...extraPlans].map((p) => overrides[p.id] ?? p),
    [defaultPlans, extraPlans, overrides],
  );

  const handleSavePlan = (data: PlanData) => {
    if (editing?.isNew) {
      setExtraPlans((prev) => [...prev, data]);
    } else {
      setOverrides((prev) => ({ ...prev, [data.id]: data }));
    }
    setEditing(null);
  };

  const openNewPlan = () =>
    setEditing({
      isNew: true,
      plan: {
        id: `custom-${Date.now()}`,
        name: '',
        description: '',
        tagline: '',
        credits: 0,
        price: 0,
        features: [],
        isPopular: false,
      },
    });

  /* ── Actions ── */
  const handleAddPack = (id: number) =>
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, listings: m.listings + 1 } : m)));

  const handleAddCredit = (id: number) => {
    // TODO: API call diye member-er credit adjust koro
    void id;
  };

  const handlePublish = (id: number) =>
    setPipeline((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'live' } : p)));

  const handleView = (id: number) => {
    // TODO: announcement detail page/modal open koro
    void id;
  };

  const handleConfirmGrant = () => {
    if (!granting) return;
    // TODO: API call diye package grant koro
    setRequests((prev) => prev.map((r) => (r.id === granting.id ? { ...r, granted: true } : r)));
    setGranting(null);
  };

  /* ── Derived ── */
  const filteredMembers = members.filter((m) => matches(memberQuery, nameOf(m.name), m.email));
  const filteredPipeline = pipeline.filter((p) => matches(pipelineQuery, nameOf(p.name), p.email));
  const filteredRequests = requests.filter((r) => matches(requestQuery, nameOf(r.name), r.email));
  const liveCount = pipeline.filter((p) => p.status === 'live').length;
  const openRequestsCount = requests.filter((r) => !r.granted).length;

  // Login na thakle kichu render korbe na
  if (!userInfo) return null;

  const tabClass = (active: boolean) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold text-left transition-all duration-200 cursor-pointer ${
      active
        ? 'bg-white border-[#3A7D6C] text-slate-900 ring-2 ring-[#3A7D6C]/20 shadow-sm'
        : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
    }`;

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-slate-800 p-6 md:p-10">
      <div className="container px-4 lg:px-10 mx-auto space-y-8">
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-block px-3 py-1 bg-emerald-50 text-[#3A7D6C] text-xs font-semibold rounded-full uppercase tracking-wider">
                {t('header.badge')}
              </span>
              <span className="text-sm text-slate-500 font-medium capitalize">{today}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              {t('header.title')}
            </h1>
            <p className="text-slate-600 max-w-xl text-sm md:text-base">{t('header.subtitle')}</p>
          </div>

          <div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-medium border border-slate-200 rounded shadow-sm transition-all duration-200 cursor-pointer"
            >
              <FiLogOut size={18} />
              <span>{t('header.logout')}</span>
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            icon={<FiUsers size={20} />}
            tone="bg-slate-100 text-slate-600"
            label={t('stats.totalMembers')}
            value={formattedTotal}
          />
          <StatCard
            icon={<FiCreditCard size={20} />}
            tone="bg-emerald-50 text-[#3A7D6C]"
            label={t('stats.paidUsers')}
            value={PAID_USERS.toLocaleString(i18n.language)}
          />
          <StatCard
            icon={<FiActivity size={20} />}
            tone="bg-slate-100 text-slate-600"
            label={t('stats.pipelineLoad')}
            value={t('stats.active', { count: liveCount })}
          />
        </div>

        {/* ── Tabs ── */}
        <div role="tablist" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            role="tab"
            aria-selected={activeTab === 'listings'}
            onClick={() => setActiveTab('listings')}
            className={tabClass(activeTab === 'listings')}
          >
            <FiFileText size={16} className="shrink-0" />
            <span className="truncate">{t('tabs.manageListings')}</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'pricing'}
            onClick={() => setActiveTab('pricing')}
            className={tabClass(activeTab === 'pricing')}
          >
            <FiCreditCard size={16} className="shrink-0" />
            <span className="truncate">{t('tabs.pricingRequests')}</span>
          </button>
        </div>

        {/* ════════ TAB 1: Manage listings ════════ */}
        {activeTab === 'listings' && (
          <div className="space-y-8">
            {/* Active members */}
            <TableCard
              title={t('activeMembers.title')}
              subtitle={t('activeMembers.subtitle', {
                shown: filteredMembers.length,
                total: formattedTotal,
              })}
              search={
                <SearchBox
                  value={memberQuery}
                  onChange={setMemberQuery}
                  placeholder={t('common.searchUsers')}
                />
              }
            >
              <table className="w-full min-w-[680px] text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className={thClass}>{t('activeMembers.columns.identity')}</th>
                    <th className={`${thClass} text-center`}>{t('activeMembers.columns.package')}</th>
                    <th className={`${thClass} text-center`}>{t('activeMembers.columns.balance')}</th>
                    <th className={`${thClass} text-center`}>{t('activeMembers.columns.ledger')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className={tdClass}>
                        <Identity name={nameOf(m.name)} email={m.email} />
                      </td>
                      <td className={`${tdClass} text-center`}>
                        <span
                          className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold tracking-wide whitespace-nowrap ${
                            m.isPaid
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {m.isPaid ? t('common.paidMember') : t('common.freeMember')}
                        </span>
                      </td>
                      <td className={`${tdClass} text-center text-sm font-semibold text-slate-900 whitespace-nowrap`}>
                        {t('activeMembers.listingCount', { count: m.listings })}
                      </td>
                      <td className={tdClass}>
                        <div className="flex items-center justify-center gap-2">
                          <button className={btnOutline} onClick={() => handleAddPack(m.id)}>
                            {t('activeMembers.addPack')}
                          </button>
                          <button className={btnPrimary} onClick={() => handleAddCredit(m.id)}>
                            {t('activeMembers.addCredit')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableCard>

            {/* Approval pipeline */}
            <TableCard
              title={t('approvalPipeline.title')}
              subtitle={t('approvalPipeline.subtitle', {
                shown: filteredPipeline.length,
                total: formattedTotal,
              })}
              search={
                <SearchBox
                  value={pipelineQuery}
                  onChange={setPipelineQuery}
                  placeholder={t('common.searchUsers')}
                />
              }
            >
              <table className="w-full min-w-[640px] text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className={thClass}>{t('approvalPipeline.columns.property')}</th>
                    <th className={thClass}>{t('approvalPipeline.columns.userId')}</th>
                    <th className={`${thClass} text-center`}>{t('approvalPipeline.columns.status')}</th>
                    <th className={`${thClass} text-center`}>{t('approvalPipeline.columns.action')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPipeline.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className={`${tdClass} text-sm text-slate-700`}>
                        {t('approvalPipeline.propertyTypes.apartment')}
                      </td>
                      <td className={tdClass}>
                        <Identity name={nameOf(p.name)} email={p.email} />
                      </td>
                      <td className={`${tdClass} text-center`}>
                        <StatusBadge tone={p.status}>
                          {p.status === 'live' ? t('common.liveStatus') : t('common.pending')}
                        </StatusBadge>
                      </td>
                      <td className={tdClass}>
                        {p.status === 'pending' && (
                          <div className="flex items-center justify-center gap-2">
                            <button className={btnOutline} onClick={() => handleView(p.id)}>
                              {t('common.view')}
                            </button>
                            <button className={btnPrimary} onClick={() => handlePublish(p.id)}>
                              {t('common.live')}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableCard>
          </div>
        )}

        {/* ════════ TAB 2: Pricing & requests ════════ */}
        {activeTab === 'pricing' && (
          <div className="space-y-10">
            {/* Pricing cards */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{t('pricing.title')}</h2>
                <button
                  onClick={openNewPlan}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-50 shadow-sm transition-all duration-200 cursor-pointer"
                >
                  <FiPlus size={16} />
                  <span>{t('pricing.addPackage')}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-5 lg:gap-6 items-stretch pt-4">
                {plans.map((p) => (
                  <PricingCard
                    key={p.id}
                    plan={{
                      name: p.name,
                      badge: p.isPopular ? t('pricing.popularBadge') : undefined,
                      description: p.description,
                      credits: t('pricing.credits', { count: p.credits }),
                      price: `${p.price.toFixed(2)} CHF`,
                      subPrice: t('pricing.perCredit', {
                        price: (p.credits > 0 ? p.price / p.credits : 0).toFixed(2),
                      }),
                      tagline: p.tagline,
                      features: p.features,
                      buttonText: t('pricing.editPackage'),
                      isPopular: p.isPopular,
                    }}
                    onButtonClick={() => setEditing({ plan: p, isNew: false })}
                  />
                ))}
              </div>
            </section>

            {/* New requests */}
            <TableCard
              title={t('requests.title')}
              subtitle={t('requests.subtitle', { count: openRequestsCount })}
              search={
                <SearchBox
                  value={requestQuery}
                  onChange={setRequestQuery}
                  placeholder={t('common.searchUsers')}
                />
              }
            >
              <table className="w-full min-w-[640px] text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className={thClass}>{t('requests.columns.identity')}</th>
                    <th className={`${thClass} text-center`}>{t('requests.columns.status')}</th>
                    <th className={`${thClass} text-center`}>{t('requests.columns.package')}</th>
                    <th className={`${thClass} text-center`}>{t('requests.columns.action')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className={tdClass}>
                        <Identity name={nameOf(r.name)} email={r.email} />
                      </td>
                      <td className={`${tdClass} text-center`}>
                        <StatusBadge tone={r.status}>
                          {r.status === 'paid' ? t('common.paid') : t('common.pending')}
                        </StatusBadge>
                      </td>
                      <td className={`${tdClass} text-center`}>
                        <span className="inline-block px-2.5 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium whitespace-nowrap">
                          {t(`requests.packages.${r.pkg}`)}
                        </span>
                      </td>
                      <td className={`${tdClass} text-center`}>
                        <button
                          className={btnPrimary}
                          disabled={r.granted}
                          onClick={() => setGranting(r)}
                        >
                          {t('requests.grant')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableCard>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {editing && (
        <EditPlanModal
          plan={editing.plan}
          isNew={editing.isNew}
          onSave={handleSavePlan}
          onClose={() => setEditing(null)}
        />
      )}

      {granting && (
        <GrantModal
          request={granting}
          userName={nameOf(granting.name)}
          onConfirm={handleConfirmGrant}
          onClose={() => setGranting(null)}
        />
      )}
    </div>
  );
}