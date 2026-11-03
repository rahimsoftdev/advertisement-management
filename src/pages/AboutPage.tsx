import { useTranslation } from "react-i18next";
import AboutHero from "../components/about/AboutHero";
import MissionSection from "../components/about/Missionsection";
import ExpertiseSection from "../components/about/ExpertiseSection";

const AboutPage = () => {
  const { t } = useTranslation("about");

  return (
    <div>
      {/* Hero Section */}
      <AboutHero/>

      {/* Mission Section */}
      <MissionSection/>

      {/* Expertise Section */}
      <ExpertiseSection/>
    </div>
  );
};

export default AboutPage;