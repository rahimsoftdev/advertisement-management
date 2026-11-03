// components/MissionSection.tsx
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import mission from '../../assets/images/mission.png'
import mission2 from '../../assets/images/mission2.png'


const MissionSection: FC = () => {
  const { t } = useTranslation("about");

  return (
    <section
      className="py-10 sm:py-12 lg:py-section bg-[#FAF9F7]"
      aria-labelledby="mission-title"
    >
      {/* container => max-width + mx-auto already ache */}
      <div className="container mx-auto px-4 lg:px-10">
        <div className="mx-auto grid max-w-4xl  gap-4 sm:gap-10 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-14">
          {/* ---------- Images collage ---------- */}
          <div className="relative mx-auto aspect-[340/262] w-full max-w-[420px] lg:mx-0 lg:max-w-none">
            <img
              src={mission}
              alt={t("mission.imageAlt1")}
              width={276}
              height={172}
              loading="lazy"
              decoding="async"
              className="absolute left-0 top-0 aspect-[276/172] w-[81%] rounded-lg object-cover shadow-sm"
            />
            <img
              src={mission2}
              alt={t("mission.imageAlt2")}
              width={231}
              height={144}
              loading="lazy"
              decoding="async"
              className="absolute bottom-0 right-0 aspect-[231/144] w-[68%] rounded-lg object-cover shadow-md"
            />
          </div>

          {/* ---------- Text ---------- */}
          <div className="flex flex-col text-center lg:text-left items-center">
            <h2
              id="mission-title"
              className="font-['Inter'] text-3xl font-semibold tracking-[-0.01em] text-primaryText sm:text-4xl lg:text-[40px] lg:leading-[1.15]"
            >
              {t("mission.title")}
            </h2>

            <div className="mt-3 flex flex-col gap-5 sm:mt-4 text-center">
              <p className="font-['Inter'] text-[15px] leading-snug text-secondaryText sm:text-base lg:text-[17px]">
                {t("mission.description1")}
              </p>
              <p className="font-['Inter'] text-[15px] leading-snug text-secondaryText sm:text-base lg:text-[17px]">
                {t("mission.description2")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;