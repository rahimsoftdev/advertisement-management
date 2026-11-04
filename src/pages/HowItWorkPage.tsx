import React from 'react'
import CtaSection from '../components/home/CtaSection'
import Hero from '../components/home/Hero'
import { useTranslation } from "react-i18next";
import HowWorkSteps from '../components/how/HowWorkSteps';

export default function HowItWorkPage() {
  const { t } = useTranslation("howwork");
  return (
    <div>
        <Hero/>
        <HowWorkSteps/>
        <CtaSection/> 
    </div>
  )
}