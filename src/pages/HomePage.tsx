
import Hero from '../components/home/Hero'
// import CtaSection from '../components/home/CtaSection'
import WhyCasagen from '../components/home/WhyCasagen'
import FastListing from '../components/home/FastListing'
import ExpertSection from '../components/home/ExpertSection'
import HowItWorks from '../components/home/HowItWorks'
import CreateListingBanner from '../components/home/CreateListingBanner'

export default function HomePage() {
  return (
    <div>
      <Hero />
      <WhyCasagen />


      <CreateListingBanner/>


      <HowItWorks />
      <ExpertSection />

      <FastListing />
      {/* <CtaSection/> */}
    </div>
  )
}
