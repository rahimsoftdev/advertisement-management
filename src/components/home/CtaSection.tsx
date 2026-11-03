import React from 'react';
import { useTranslation } from 'react-i18next';

/* Background cube pattern (left / right e use hobe) */
const CubePattern: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 200 200"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    aria-hidden="true"
  >
    {[0, 1, 2].map((row) =>
      [0, 1, 2].map((col) => {
        const x = col * 60 + (row % 2 ? 30 : 0);
        const y = row * 52;
        return (
          <g key={`${row}-${col}`} transform={`translate(${x} ${y})`}>
            {/* hexagon */}
            <polygon points="30,0 60,17 60,52 30,69 0,52 0,17" />
            {/* cube inner lines */}
            <polyline points="0,17 30,34 60,17" />
            <line x1="30" y1="34" x2="30" y2="69" />
          </g>
        );
      })
    )}
  </svg>
);

const CtaSection: React.FC = () => {
  const { t } = useTranslation('home');

  return (
    <section className="relative overflow-hidden bg-white py-10 sm:py-12 lg:py-section">
      {/* Left pattern */}
      <CubePattern className="pointer-events-none absolute -left-10 top-0 h-56 w-56 text-gray-200/70 sm:h-64 sm:w-64" />

      {/* Right pattern */}
      <CubePattern className="pointer-events-none absolute -right-10 bottom-0 h-56 w-56 text-gray-200/70 sm:h-64 sm:w-64" />

      <div className="container relative z-10 mx-auto px-4 text-center">
        {/* Title */}
        <h2 className="mx-auto mb-5 max-w-[280px] text-xl font-bold leading-snug tracking-tight  sm:max-w-xs sm:text-2xl md:max-w-sm text-primaryText">
          {t('cta.title')}
        </h2>

        {/* Button */}
        <div>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-myprimary px-5 py-2.5 font-poppins text-xs font-medium text-white shadow-md ring-1 ring-myprimary/60 ring-offset-2 ring-offset-white transition-all duration-200 hover:bg-[#33705f]/90 active:scale-95 sm:text-sm"
          >
            <span>{t('cta.buttonText')}</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;