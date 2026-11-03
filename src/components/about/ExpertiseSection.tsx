import React from "react";
import { useTranslation } from "react-i18next";
import { FiBarChart2, FiShield, FiTrendingUp } from "react-icons/fi"; // React Icons import kora holo
import exportimage from '../../assets/images/export.png'

const ExpertiseSection = () => {
  const { t } = useTranslation("about");

  return (
    <section className="pb-10 sm:pb-12 lg:pb-section bg-[#FAF9F7]">
      <div className="container max-w-7xl mx-auto px-4 mx-auto lg:px-10">
        <div className="flex flex-col lg:flex-row  justify-between gap-4 sm:gap-6 lg:gap-16">
          
          {/* Left Side: Title, Description, and Footer Tagline */}
          <div className="w-full lg:w-1/2 flex flex-col items-center text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primaryText leading-tight mb-6 !text-center">
              {t("expertise.title")}
            </h2>
            
            <p className="text-secondaryText text-base sm:text-lg leading-relaxed mb-5">
              {t("expertise.description")}
            </p>

            {/* Divider Line */}
            <div className="w-full h-[1px] bg-gray-200 mb-5"></div>

            {/* Footer Tagline */}
            <p className="text-primaryText font-medium text-base sm:text-lg text-center">
              {t("expertise.footerText")}
            </p>
          </div>

          {/* Right Side: Image and Feature Icons */}
          <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end gap-4 sm:gap-6">
            
            {/* Main Image Box with Border */}
            <div className="relative rounded-2xl overflow-hidden border overflow-hidden border-myprimary shadow-md w-full max-w-[500px]">
              <img 
                src={exportimage}
                alt="Expertise meeting" 
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Right Side Vertical Icons using React Icons */}
            <div className="flex flex-col gap-3 sm:gap-4 shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-myprimary flex items-center justify-center text-emerald-800 bg-white shadow-sm hover:bg-emerald-50 transition">
                <FiBarChart2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-myprimary flex items-center justify-center text-emerald-800 bg-white shadow-sm hover:bg-emerald-50 transition">
                <FiShield className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-myprimary flex items-center justify-center text-emerald-800 bg-white shadow-sm hover:bg-emerald-50 transition">
                <FiTrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default ExpertiseSection;