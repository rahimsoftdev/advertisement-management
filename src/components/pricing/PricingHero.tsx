import React from 'react';
import { useTranslation } from 'react-i18next';
import laptop from '../../assets/images/laptop.png';

/**
 * If your laptop.png has transparent empty space around the laptop,
 * these two values compensate for it.
 *  - LAPTOP_SCALE  : bigger = laptop looks bigger
 *  - LAPTOP_DROP   : bigger negative = laptop sits lower
 * If you crop the PNG tightly, set LAPTOP_SCALE = 1 and LAPTOP_DROP = '0%'.
 */
const LAPTOP_SCALE = 1.6;
const LAPTOP_DROP = '-16%';

/**
 * Background shapes (drawn in a 305 x 240 box, stretched to fit the column).
 * Tweak these two paths if you want to adjust the curves.
 */
const BLOB_PATH =
  'M11 240 V152 C11 80 56 34 112 34 H204 C240 34 264 62 264 100 V240 Z';
const OUTLINE_PATH =
  'M4 240 V150 C4 72 52 20 112 20 H208 C250 20 273 58 273 104 V240';

const PricingHero: React.FC = () => {
  const { t } = useTranslation('pricing');

  return (
    <section className="relative overflow-hidden bg-[#FFFCF6] pt-5 sm:pt-12 lg:pt-14">
      {/* Container: max-width + centered, text sits on its left edge, image on its right edge */}
      <div className="container mx-auto px-4 lg:px-10">
        <div className="grid w-full grid-cols-1 lg:grid-cols-[56%_44%] lg:aspect-[700/240]">

          {/* ───────── Left: Badge, Title, Description, Button ───────── */}
          <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left pt-14 pb-8 lg:py-0">

            {/* Badge */}
            <span className="inline-block px-3 py-1 rounded-full bg-myprimary text-white text-[11px] sm:text-xs font-semibold tracking-wide">
              {t('hero.badge')}
            </span>

            {/* Title */}
            <h1 className="mt-4 lg:mt-[2%] text-4xl lg:text-[clamp(2.25rem,3.7vw,4.5rem)] font-extrabold tracking-tight text-primaryText leading-[1.12] max-w-[520px] lg:max-w-none">
              {t('hero.title')}
            </h1>

            {/* Description */}
            <p className="mt-4 lg:mt-[2%] text-secondaryText font-poppins text-sm sm:text-base lg:text-[clamp(0.875rem,1.1vw,1.25rem)] leading-snug max-w-[420px] lg:max-w-[75%]">
              {t('hero.description')}
            </p>

            {/* Button */}
            <button className="mt-5 lg:mt-[2.5%] inline-flex items-center justify-center px-5 py-2.5 lg:px-[1.6vw] lg:py-[0.8vw] rounded-md bg-myprimary text-white text-sm lg:text-[clamp(0.875rem,1.05vw,1.15rem)] font-medium hover:bg-[#31695b] transition-colors duration-200 cursor-pointer">
              <span>{t('hero.buttonText')}</span>
            </button>
          </div>

          {/* ───────── Right: outline + green blob + laptop ───────── */}
          <div className="relative h-[300px] sm:h-[420px] lg:h-full">

            {/* Outline + solid blob (one SVG, stretches with the column) */}
            <svg
              aria-hidden="true"
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 305 240"
              preserveAspectRatio="none"
            >
              {/* thin outline, offset behind the blob */}
              <path
                d={OUTLINE_PATH}
                fill="none"
                stroke="#3b7d6b"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              {/* solid green blob */}
              <path d={BLOB_PATH} fill="#3b7d6b" />
            </svg>

            {/* Laptop – sits on the bottom edge, wider than the blob */}
            <img
              src={laptop}
              alt="Pricing Dashboard Mockup"
              draggable={false}
              className="absolute bottom-0 left-1/2 w-[97%] h-auto max-w-none select-none pointer-events-none origin-bottom"
              style={{
                transform: `translateX(-50%) scale(${LAPTOP_SCALE})`,
                marginBottom: LAPTOP_DROP,
              }}
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default PricingHero;