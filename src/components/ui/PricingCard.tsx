import React from 'react';
import { FaStar } from 'react-icons/fa';
import { FiCheckCircle } from 'react-icons/fi';

interface Plan {
  name: string;
  badge?: string;
  description: string;
  credits: string;
  price: string;
  subPrice: string;
  tagline: string;
  features: string[];
  buttonText: string;
  isPopular: boolean;
}

interface PricingCardProps {
  plan: Plan;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan }) => {
  return (
    <div
      className={`relative flex flex-col rounded-xl p-5 sm:p-6 transition-all duration-300 ${
        plan.isPopular
          ? 'bg-myprimary text-white border border-myprimary'
          : 'bg-white text-primaryText border border-[#D1D5DB] hover:border-myprimary/50'
      }`}
    >
      {/* Popular Badge */}
      {plan.isPopular && plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#FFC81E] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-primaryText">
          <FaStar className="text-[11px]" />
          {plan.badge}
        </div>
      )}

      {/* ── Name & Description (fixed height so every card lines up) ── */}
      <div>
        <h3
          className={`text-sm sm:text-base font-bold uppercase tracking-wide ${
            plan.isPopular ? 'text-white' : 'text-primaryText'
          }`}
        >
          {plan.name}
        </h3>
        <p
          className={`mt-2 text-xs font-poppins leading-relaxed line-clamp-2 min-h-[2.5rem] ${
            plan.isPopular ? '!text-white' : 'text-secondaryText'
          }`}
        >
          {plan.description}
        </p>
      </div>

      {/* ── Credits & Price ── */}
      <div className="mt-5">
        <div className="text-2xl sm:text-[28px] font-bold leading-tight">
          {plan.credits}
        </div>
        <div className="mt-2 text-2xl sm:text-[28px] font-bold leading-tight">
          {plan.price}
        </div>
        <div
          className={`mt-2 text-[9px] font-medium uppercase tracking-wide ${
            plan.isPopular ? 'text-white/70' : 'text-secondaryText/70'
          }`}
        >
          {plan.subPrice}
        </div>
      </div>

      {/* ── Tagline (fixed height, single line) ── */}
      <p
        className={`mt-3 min-h-[2.5rem] text-xs sm:text-[13px] font-medium font-poppins leading-snug line-clamp-2 ${
          plan.isPopular ? 'text-white' : 'text-primaryText'
        }`}
      >
        {plan.tagline}
      </p>

      {/* ── Button ── */}
      <button
        type="button"
        className={`mt-4 w-full rounded-sm px-4 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
          plan.isPopular
            ? 'bg-white text-myprimary hover:bg-gray-100'
            : 'bg-white text-myprimary border border-myprimary hover:bg-myprimary hover:text-white'
        }`}
      >
        {plan.buttonText}
      </button>

      {/* ── Features (pushed to the bottom block, same start line on every card) ── */}
      <ul className="mt-6 space-y-2.5">
        {plan.features &&
          plan.features.map((feature, fIndex) => (
            <li key={fIndex} className="flex items-center gap-2.5">
              <FiCheckCircle
                className={`text-base shrink-0 ${
                  plan.isPopular ? 'text-white' : 'text-myprimary'
                }`}
              />
              <span
                className={`text-xs font-poppins leading-snug ${
                  plan.isPopular ? 'text-white/90' : 'text-secondaryText'
                }`}
              >
                {feature}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default PricingCard;