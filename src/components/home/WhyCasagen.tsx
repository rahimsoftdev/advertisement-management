import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router';

const images = {
  building:
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  interior:
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
  colorful:
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  living:
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
};

const stats = [1, 2, 3, 4] as const;

const WhyCasagen: React.FC = () => {
  const { t } = useTranslation('home');

  return (
    <section className="relative overflow-hidden bg-white py-10 sm:py-12 lg:py-section">
      <div className="container mx-auto px-4 lg:px-10">
        {/* Header row: label + title (left) | description (right) */}
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-3">
            <span className="block text-xs font-semibold uppercase tracking-wider text-myprimary sm:text-sm">
              {t('whyCasagen.subtitle')}
            </span>
            <h2 className="text-2xl font-extrabold leading-[1.2] tracking-tight text-primaryText sm:text-3xl lg:text-4xl">
              {t('whyCasagen.title')}
            </h2>
          </div>

          <p className="font-poppins text-sm leading-relaxed text-secondaryText sm:text-base lg:pt-6">
            {t('whyCasagen.description')}
          </p>
        </div>

        {/* Content row: stats (left) | image collage (right) */}
        <div className="mt-8 grid grid-cols-1 items-start gap-10 lg:mt-10 lg:grid-cols-2 lg:gap-12">
          {/* Left: stats + button */}
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {stats.map((n) => (
                <div
                  key={n}
                  className="relative flex min-h-[110px] flex-col items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-white px-3 py-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.06)] sm:min-h-[130px]"
                >
                  {/* Faded watermark number */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 flex select-none items-center justify-center whitespace-nowrap text-5xl font-extrabold text-myprimary/10 sm:text-6xl"
                  >
                    {t(`whyCasagen.stat${n}Title`)}
                  </span>

                  <h3 className="relative text-2xl font-semibold text-primaryText sm:text-3xl">
                    {t(`whyCasagen.stat${n}Title`)}
                  </h3>
                  <p className="font-poppins relative mt-1 text-[11px] text-secondaryText sm:text-xs">
                    {t(`whyCasagen.stat${n}Desc`)}
                  </p>
                </div>
              ))}
            </div>

            <Link
              to="/about"
              className="group inline-flex cursor-pointer items-center gap-2 rounded-md bg-myprimary px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-[#31695b] sm:text-base"
            >
              <span>{t('whyCasagen.buttonText')}</span>
              <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Right: collage */}
          <div className="grid aspect-[210/201] w-full grid-cols-6 grid-rows-[63fr_87fr_49fr] gap-1.5 sm:gap-2">
            {/* Top left: building */}
            <div className="col-span-3 row-span-1 overflow-hidden rounded-md">
              <img
                src={images.building}
                alt="Building"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Top right: interior */}
            <div className="col-span-3 row-span-1 overflow-hidden rounded-md">
              <img
                src={images.interior}
                alt="Interior"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Bottom left: small, colorful facade */}
            <div className="col-span-2 row-span-2 row-start-2 overflow-hidden rounded-md sm:rounded-lg">
              <img
                src={images.colorful}
                alt="Facade"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Bottom right: big living room (spans 2 rows) */}
            <div className="col-span-4 col-start-3 row-span-2 row-start-2 overflow-hidden rounded-md">
              <img
                src={images.living}
                alt="Living room"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyCasagen;