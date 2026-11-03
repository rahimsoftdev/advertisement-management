import React from 'react'
import Hero from '../components/home/Hero'
// import CtaSection from '../components/home/CtaSection'
import WhyCasagen from '../components/home/WhyCasagen'
import FastListing from '../components/home/FastListing'
import ExpertSection from '../components/home/ExpertSection'

export default function HomePage() {
  return (
    <div>
      <Hero/>
      <WhyCasagen/>



      <ExpertSection/>

      <FastListing/>
      {/* <CtaSection/> */}
    </div>
  )
}
