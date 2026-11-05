import React from 'react';
import { useTranslation } from 'react-i18next';
import { HiOutlineDocumentText } from 'react-icons/hi2';

// Cream notepad + pen illustration (no external image needed)
interface PricingCardProps {
  isPricing?: boolean;
}
const NotePad: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 120 110"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g transform="rotate(-8 60 60)">
      <rect x="10" y="22" width="78" height="72" rx="8" fill="#F6E6CC" />
      <rect x="10" y="22" width="78" height="72" rx="8" fill="none" stroke="#EAD3AE" strokeWidth="1.5" />
      <path
        d="M24 46c6-4 10 4 16 0s10 4 16 0 8 2 14 0M24 60c6-4 10 4 16 0s10 4 16 0M24 74c6-4 10 4 16 0"
        fill="none"
        stroke="#B9A07A"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
    {/* Pen */}
    <g transform="rotate(38 88 40)">
      <rect x="82" y="2" width="9" height="62" rx="4" fill="#D9A55B" />
      <rect x="82" y="2" width="9" height="12" rx="4" fill="#C4893F" />
      <path d="M82 64h9l-4.5 12z" fill="#F3D9B0" />
      <path d="M85 72h3l-1.5 4z" fill="#555" />
    </g>
  </svg>
);

const CreateListingBanner: React.FC<PricingCardProps> = ({
  isPricing = false,
}) => {
  const { t } = useTranslation('home');

  return (
    <section className={`relative overflow-hidden ${isPricing ? 'bg-white' : 'bg-[#FAF9F7]'} `}>
      <div className={`container mx-auto px-4  lg:px-10 ${isPricing && 'py-10 sm:py-12 lg:py-section'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 ">
          {/* Left Side */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-center lg:text-left">
            {/* Header */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-primaryText leading-[1.25] max-w-md mx-auto lg:mx-0">
                {t('createListing.title')}
              </h2>
              <p className="text-secondaryText text-xs sm:text-sm font-poppins max-w-sm mx-auto lg:mx-0">
                {t('createListing.subtitle')}
              </p>
            </div>

            {/* Green Card with outer ring */}
            <div className="w-full max-w-md lg:max-w-[440px] mx-auto lg:mx-0 p-1.5 rounded-[28px] border- border-myprimary/70 bg-white/40">
              <div className="rounded-3xl bg-myprimary text-white shadow-lg px-5 py-6 sm:px-8 sm:py-8 text-center space-y-4 sm:space-y-5">
                {/* Icon */}
                <div className="mx-auto w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-myprimary flex items-center justify-center">
                  <HiOutlineDocumentText className="text-xl sm:text-2xl" aria-hidden="true" />
                </div>

                {/* Text */}
                <div className="space-y-2">
                  <h3 className="text-base   sm:text-lg font-bold leading-snug">
                    {t('createListing.cardTitle')}
                  </h3>
                  <p className="text-[11px] sm:text-xs !text-white font-poppins leading-relaxed max-w-sm mx-auto">
                    {t('createListing.cardDescription')}
                  </p>
                </div>

                {/* CTA */}
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-primaryText text-sm sm:text-base font-medium font-poppins shadow-md hover:bg-gray-100 active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40 transition-all duration-200 cursor-pointer"
                >
                  {t('createListing.buttonText')}
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Image Collage */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-md sm:max-w-lg space-y-3 sm:space-y-4">
              {/* Top: Building */}
              <div className="overflow-hidden rounded-2xl shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80"
                  alt={t('createListing.buildingAlt', 'Immeuble moderne')}
                  loading="lazy"
                  className="w-full aspect-[16/10] object-cover"
                />
              </div>

              {/* Bottom row: Notepad + Signing image */}
              <div className="relative flex items-end">
                {/* Notepad (overlaps left of the image) */}
                <div className="relative z-10 w-[34%] -mr-6 sm:-mr-8 -mb-1 shrink-0">
                  <NotePad className="w-full h-auto drop-shadow-md" />
                </div>

                {/* Signing image */}
                <div className="flex-1 overflow-hidden rounded-2xl shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=700&q=80"
                    alt={t('createListing.signingAlt', 'Signature de documents')}
                    loading="lazy"
                    className="w-full aspect-[16/8] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateListingBanner;