import React from 'react';
import { useTranslation } from 'react-i18next';

const ShieldCheck: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 48 56"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M24 0L48 8V28C48 42 38 51 24 56C10 51 0 42 0 28V8L24 0Z"
      fill="currentColor"
    />
    <path
      d="M13 28L21 36L35 20"
      fill="none"
      stroke="#fff"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SwissFlag: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 16 16"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect width="16" height="16" rx="2" fill="#E8202A" />
    <path d="M7 3.5h2v3.5h3.5v2H9v3.5H7V9H3.5V7H7z" fill="#fff" />
  </svg>
);

const ExpertSection: React.FC = () => {
  const { t } = useTranslation('home');

  return (
    <section className="relative overflow-hidden bg-[#FAF9F7] py-10 sm:py-12 lg:py-section">
      <div className="container mx-auto px-4  lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-10 ">
          {/* Left Side */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold tracking-tight text-primaryText leading-[1.3] max-w-xl mx-auto lg:mx-0">
              {t('expertSection.title')}
            </h2>

            {/* Badge Card */}
            <div className="inline-flex items-center gap-4 pl-4 pr-8 py-3 rounded-xl bg-white border border-[#EEEEEE] shadow-[0_2px_10px_rgba(0,0,0,0.06)] text-left">
              <ShieldCheck className="w-11 h-12 text-myprimary shrink-0" />
              <div className="space-y-1">
                <h4 className="text-lg sm:text-xl font-bold text-primaryText leading-tight">
                  {t('expertSection.badgeTitle')}
                </h4>
                <p className="flex items-center gap-2 text-sm text-secondaryText font-poppins">
                  <SwissFlag className="w-4 h-4 shrink-0" />
                  <span>{t('expertSection.badgeSubtitle')}</span>
                </p>
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-2">
              <p className="text-sm sm:text-base font-medium text-[#2F3745] font-poppins">
                {t('expertSection.description')}
              </p>
              <p className="text-[11px] sm:text-xs text-secondaryText font-poppins leading-snug max-w-xs mx-auto lg:mx-0">
                {t('expertSection.footerText')}
              </p>
            </div>
          </div>

          {/* Right Side: Image Collage */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md sm:max-w-lg pr-3 pb-3 sm:pr-4 sm:pb-4">
              {/* Green offset outline (visible on right & bottom) */}
              <div
                aria-hidden="true"
                className="absolute inset-0 translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4 rounded-2xl border-2 border-myprimary"
              />

              {/* Main Image */}
              <div className="relative z-10 overflow-hidden rounded-2xl shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80"
                  alt={t('expertSection.mainImageAlt', 'Dossier immobilier')}
                  loading="lazy"
                  className="w-full aspect-[4/3] sm:aspect-[5/4] object-cover"
                />
              </div>

              {/* Small floating image (bottom-left) */}
              <div className="absolute z-20 -bottom-5 -left-3 sm:-bottom-6 sm:-left-8 w-28 sm:w-36 overflow-hidden rounded-xl border-[5px] border-white bg-white shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80"
                  alt={t('expertSection.smallImageAlt', 'Agent immobilier')}
                  loading="lazy"
                  className="w-full aspect-[4/5] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertSection;