import React from "react";
import { useTranslation } from "react-i18next";

// Tomar image path onujayi change koro
import step1Img from "../../assets/images/step.png";
import step2Img from "../../assets/images/step2.png";
import step3Img from "../../assets/images/step3.png";

const steps = [
  { key: "section1", image: step1Img, reverse: false },
  { key: "section2", image: step2Img, reverse: true },
  { key: "section3", image: step3Img, reverse: false },
] as const;

const bullets = [1, 2, 3, 4];

/* Green connector lines between sections (desktop only) */
const Connector: React.FC<{ variant: "first" | "second" }> = ({ variant }) => (
  <svg
    aria-hidden="true"
    className="pointer-events-none absolute left-0 -top-10 z-0 hidden h-24 w-full lg:block"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    fill="none"
  >
    <path
      d={
        variant === "first"
          ? "M53 0 C 53 55, 45 45, 44 100"
          : "M45 0 C 45 60, 49 40, 49 100"
      }
      stroke="#6FBF9A"
      strokeWidth="1.2"
      vectorEffect="non-scaling-stroke"
      strokeLinecap="round"
    />
  </svg>
);

const HowWorkSteps: React.FC = () => {
  const { t } = useTranslation("howwork");

  return (
    <section className="bg-[#FAF9F7] pb-10  sm:pb-12 sm:pt-12 lg:pb-section lg:pt-20">
      <div className="container mx-auto px-4 lg:px-10">
        <div className="max-sm:border-t max-sm:pt-10">
          {steps.map((step, index) => (
            <div
              key={step.key}
              className={`relative ${
                index !== 0 ? "pt-10 sm:pt-12 lg:pt-section" : ""
              }`}
            >
              {/* Green line between sections */}
              {index === 1 && <Connector variant="first" />}
              {index === 2 && <Connector variant="second" />}

              <div className="relative z-10 grid items-center gap-6 md:grid-cols-2 lg:gap-16">
                {/* Text */}
                <div
                  className={`${
                    step.reverse ? "md:order-2" : "md:order-1"
                  } max-w-md`}
                >
                  <h3 className="mb-2 md:mb-3 text-xl font-semibold text-primaryText sm:text-2xl max-sm:text-center">
                    {t(`${step.key}.title`)}
                  </h3>

                  <p className="mb-2 md:mb-4 text-sm leading-relaxed text-secondaryText  max-sm:text-center">
                    {t(`${step.key}.description`)}
                  </p>

                  <ul className="list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-secondaryText sm:text-sm">
                    {bullets.map((b) => (
                      <li key={b}>{t(`${step.key}.bullet${b}`)}</li>
                    ))}
                  </ul>
                </div>

                {/* Image */}
                <div
                  className={`${step.reverse ? "md:order-1" : "md:order-2"}`}
                >
                  <img
                    src={step.image}
                    alt={t(`${step.key}.title`)}
                    className="h-52 w-full rounded-2xl object-cover shadow-sm sm:h-60 lg:h-84"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWorkSteps;