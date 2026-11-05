import React from 'react';
import { useTranslation } from 'react-i18next';
// import { FiCheckCircle } from 'react-icons/fi';
// import { FaStar } from 'react-icons/fa';
import PricingCard from '../ui/PricingCard';

// interface Plan {
//     name: string;
//     badge?: string;
//     description: string;
//     credits: string;
//     price: string;
//     subPrice: string;
//     /** Short line under the price, e.g. "Test facile, petit engagement" */
//     tagline?: string;
//     features: string[];
//     buttonText: string;
//     isPopular: boolean;
// }
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

const AiCreditsPricing: React.FC = () => {
    const { t } = useTranslation('pricing');

    const plans = t('aiCredits.plans', { returnObjects: true }) as Plan[];

    return (
        <section id='credits' className="relative overflow-hidden bg-[#FAF9F7] py-12 sm:py-16 lg:py-section">
            <div className="container mx-auto px-4 lg:px-10">

                {/* Section Header (left aligned) */}
                <div className="mb-3 sm:mb-12 max-w-2xl space-y-2 max-sm:text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primaryText">
                        {t('aiCredits.title')}
                    </h2>
                    <p className="text-secondaryText text-sm sm:text-base font-poppins">
                        {t('aiCredits.subtitle')}
                    </p>
                </div>

                {/* Pricing Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5 lg:gap-6 items-stretch ">
                    {plans &&
                        plans.map((plan, index) => (
                            <PricingCard key={index} plan={plan} />
                        ))}
                </div>

            </div>
        </section>
    );
};

export default AiCreditsPricing;