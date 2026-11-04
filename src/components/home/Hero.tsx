import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { FaArrowRight } from "react-icons/fa";
import heroBg from "../../assets/images/hero.png";

const Hero: React.FC = () => {
  const { t } = useTranslation("home");
  const { pathname } = useLocation();

  const isHowWork = pathname === "/how-work";

  return (
    <section
      className={`relative overflow-hidden ${isHowWork ? "bg-[#FAF9F7] " : "bg-[#FEFBF4]"
        }`}
    >
      {/* Home only: grid + buildings. /how-work te kichu nai, shudhu white bg */}
      {!isHowWork && (
        <>
          {/* Faint grid pattern (background layer) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#e6efeb_1px,transparent_1px),linear-gradient(to_bottom,#e6efeb_1px,transparent_1px)] bg-[size:56px_56px] opacity-70 sm:bg-[size:72px_72px] lg:bg-[size:84px_84px]"
          />

          {/* Buildings image: pinned to the bottom, scales with the screen */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 bg-bottom bg-no-repeat bg-[length:230%_auto] sm:bg-[length:150%_auto] lg:bg-[length:100%_auto]"
            style={{ backgroundImage: `url(${heroBg})` }}
          />
        </>
      )}

      {/* Main content.
          Extra bottom padding keeps the center clear so the buildings
          show on the left and right sides, like the design. */}
      <div className={`container relative z-10 mx-auto px-4 pt-12 lg:pt-section text-center sm:px-6 sm:pt-14 lg:pt-16 ${isHowWork ? "" : "pb-10 sm:pb-16 lg:pb-section xl:pb-30 2xl:pb-40"
        }`}>
        {/* Badge */}
        <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-md bg-gray-200/90 px-3 py-1.5 sm:mb-6">
          <span className="h-2 w-2 shrink-0 rounded-full bg-myprimary" />
          <span className="text-[11px] font-medium text-myprimary sm:text-xs">
            {t("hero.badge")}
          </span>
        </div>

        {/* Title */}
        <h1 className="mx-auto mb-4 max-w-[20rem] text-[1.75rem] font-semibold leading-[1.2] tracking-tight text-primaryText sm:mb-5 sm:max-w-xl sm:text-4xl md:max-w-2xl lg:max-w-3xl lg:text-5xl 2xl:text-6xl">
          {t("hero.title")}
        </h1>

        {/* Description */}
        <p className="mx-auto mb-7 max-w-xs font-poppins text-sm leading-relaxed text-secondaryText sm:mb-8 sm:max-w-xl sm:text-base md:max-w-2xl 2xl:text-lg">
          {t("hero.description")}
        </p>

        {/* CTA Button: only on home, hidden on /how-work */}
        {!isHowWork && (
          <button
            type="button"
            className="group font-bold inline-flex cursor-pointer items-center gap-2 rounded-md bg-myprimary px-5 py-2.5 font-poppins text-sm  text-white shadow-md transition-all duration-200 hover:bg-myprimary/90 active:scale-95 sm:px-6 sm:py-3"
          >
            <span>{t("hero.buttonText")}</span>
            <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        )}
      </div>
    </section>
  );
};

export default Hero;