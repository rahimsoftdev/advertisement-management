import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiHome, FiTarget, FiCloud } from 'react-icons/fi';

interface Step {
  number: string;
  title: string;
  description: string;
}

const icons = [FiHome, FiTarget, FiCloud];

// Staggered offsets + middle card taller (like the design)
const desktopCardClasses = [
  'md:mt-5', // card 1
  'md:mt-0 md:min-h-[230px] md:pb-10', // card 2 (bigger)
  'md:mt-3', // card 3
];

const HowItWorks: React.FC = () => {
  const { t } = useTranslation('home');

  const steps = ((t('howItWorks.steps', { returnObjects: true }) as Step[]) || []).slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-[#FAF9F7] pt-10 sm:pt-12 lg:pt-section ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="max-w-xl mb-8 sm:mb-10 lg:mb-12 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold tracking-tight text-primaryText mb-2">
            {t('howItWorks.title')}
          </h2>
          <p className="text-secondaryText text-sm sm:text-base font-poppins">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        {/* Steps */}
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 items-start list-none p-0 m-0">
          {steps.map((step, index) => {
            const Icon = icons[index] ?? FiHome;

            return (
              <li
                key={index}
                className={`relative rounded-xl bg-[#E8EDEA] p-5 sm:p-6 transition-shadow duration-300 hover:shadow-md ${desktopCardClasses[index] ?? ''}`}
              >
                {/* Top Row: Icon & Number */}
                <div className="flex items-start justify-between mb-5 sm:mb-6">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-myprimary text-white flex items-center justify-center shadow-sm shrink-0">
                    <Icon className="text-base sm:text-lg" aria-hidden="true" />
                  </div>

                  <span
                    aria-hidden="true"
                    className="text-2xl sm:text-3xl font-bold leading-none text-myprimary/25 select-none"
                  >
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-semibold text-[#2F3745] leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-secondaryText font-poppins leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default HowItWorks;