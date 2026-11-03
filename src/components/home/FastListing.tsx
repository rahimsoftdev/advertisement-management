import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiCheckCircle } from 'react-icons/fi';
import { HiOutlineRocketLaunch } from 'react-icons/hi2';

const FastListing: React.FC = () => {
  const { t } = useTranslation('home');

  // Features list array from translation
  const features = (t('fastListing.features', { returnObjects: true }) as string[]) || [];

  return (
    <section className="relative overflow-hidden bg-white py-10 sm:py-14 lg:py-20 border-b border-[#eee]">
      {/* Decorative hexagon pattern (right side, like the design) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-full sm:w-3/4 lg:w-1/2 opacity-60"
      >
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMaxYMid slice"
        >
          <defs>
            <pattern
              id="hex-pattern"
              width="56"
              height="100"
              patternUnits="userSpaceOnUse"
              patternTransform="scale(1.1)"
            >
              <path
                d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100"
                fill="none"
                stroke="#E6EBE9"
                strokeWidth="1"
              />
              <path
                d="M28 0L28 34L0 50L0 84L28 100L56 84L56 50L28 34"
                fill="none"
                stroke="#E6EBE9"
                strokeWidth="1"
              />
            </pattern>
            <linearGradient id="hex-fade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="60%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex-pattern)" />
          <rect width="100%" height="100%" fill="url(#hex-fade)" />
        </svg>
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-10 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Side: Title & Checkpoints */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-[#222831] leading-[1.2] max-w-md mx-auto lg:mx-0">
              {t('fastListing.title')}
            </h2>

            <ul className="flex flex-col gap-3 sm:gap-4 w-fit mx-auto lg:mx-0 text-left">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start sm:items-center gap-3">
                  <FiCheckCircle className="text-myprimary text-lg shrink-0 mt-0.5 sm:mt-0" />
                  <span className="text-sm sm:text-base text-secondaryText font-poppins font-medium">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side: Pricing Card */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-md lg:max-w-lg p-6 sm:p-8 lg:p-10 rounded bg-[#FAF9F7] border border-[#eee] shadow text-center space-y-5 sm:space-y-6">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E5EFEB] text-myprimary mx-auto shadow-sm">
                <HiOutlineRocketLaunch className="text-xl sm:text-2xl" />
              </div>

              {/* Pricing Title & Description */}
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#222831]">
                  {t('fastListing.pricingTitle')}
                </h3>
                <p className="text-xs sm:text-sm text-secondaryText font-poppins leading-relaxed max-w-sm mx-auto">
                  {t('fastListing.pricingDesc')}
                </p>
              </div>

              {/* Button */}
              <div className="pt-1">
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-myprimary text-white text-sm sm:text-base font-medium shadow-lg hover:bg-[#31695b] active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-myprimary/30 transition-all duration-200 cursor-pointer"
                >
                  <span>{t('fastListing.buttonText')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FastListing;