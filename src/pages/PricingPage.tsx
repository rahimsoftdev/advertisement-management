import CtaSection from '../components/home/CtaSection';
import CreateListingBanner from '../components/home/CreateListingBanner';
import PricingHero from '../components/pricing/PricingHero';
import AiCreditsPricing from '../components/pricing/AiCreditsPricing';

const PricingPage = () => {
    return (
        <div>
            <PricingHero/>
             <CreateListingBanner isPricing={true} />
             <AiCreditsPricing/>
            <CtaSection/> 
        </div>
    );
};

export default PricingPage;