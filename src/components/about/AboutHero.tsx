// components/AboutHero.tsx
import { useMemo, type FC } from "react";
import { useTranslation } from "react-i18next";

/* ---------- Decorative wave lines (fine ribbon, like the design) ---------- */
const WaveLines: FC = () => {
  const { ribbonA, ribbonB } = useMemo(() => {
    const COUNT = 34;
    const a: string[] = [];
    const b: string[] = [];

    for (let i = 0; i < COUNT; i++) {
      const t = i / (COUNT - 1);

      // Left ribbon: starts at left edge, sweeps down towards the centre-bottom
      a.push(
        `M -40 ${205 + t * 48}` +
          ` C 240 ${225 + t * 34}, 470 ${318 + t * 16}, 780 ${352 + t * 18}` +
          ` S 1060 ${398 + t * 10}, 1180 ${430 + t * 6}`
      );

      // Right-bottom ribbon: faint curve at the bottom right
      b.push(
        `M 880 ${425 + t * 10}` +
          ` C 990 ${392 + t * 8}, 1130 ${382 + t * 8}, 1260 ${402 + t * 6}` +
          ` S 1420 ${420 + t * 4}, 1500 ${410 + t * 4}`
      );
    }
    return { ribbonA: a, ribbonB: b };
  }, []);

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full select-none"
      viewBox="0 0 1440 420"
      preserveAspectRatio="xMidYMax slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="#bccbbf" strokeWidth="0.7" opacity="0.38" vectorEffect="non-scaling-stroke">
        {ribbonA.map((d, i) => (
          <path key={`a-${i}`} d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
      <g stroke="#bccbbf" strokeWidth="0.7" opacity="0.28" vectorEffect="non-scaling-stroke">
        {ribbonB.map((d, i) => (
          <path key={`b-${i}`} d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  );
};

/* ---------- Hero ---------- */
const AboutHero: FC = () => {
  const { t } = useTranslation("about");

  return (
    <section
      className="
        relative isolate overflow-hidden
        bg-[radial-gradient(ellipse_at_50%_35%,#fffdf8_0%,#fcfaf4_55%,#f6f5ed_100%)]
        py-10 sm:py-12 lg:py-section
      "
      aria-labelledby="about-hero-title"
    >
      <WaveLines />

      <div className="relative z-10 mx-auto flex max-w-[640px] flex-col items-center text-center">
        {/* Badge */}
        <span
          className="
            mb-3 inline-flex items-center rounded-full
            bg-[#dbe8e4] px-3 py-[3px]
            font-['Inter'] text-[11px] font-normal leading-[18px] text-[#5b6c74]
            sm:mb-4 sm:px-3.5 sm:text-xs
          "
        >
          {t("hero.badge")}
        </span>

        {/* Title */}
        <h1
          id="about-hero-title"
          className="
            font-['Inter'] font-semibold tracking-[-0.01em] text-primaryText
            text-[clamp(28px,5.2vw,40px)] leading-[1.15]
          "
        >
          {t("hero.title")}
        </h1>

        {/* Description */}
        <p
          className="
            mt-3 max-w-[600px] text-pretty
            font-['Poppins'] font-normal text-secondaryText
            text-[clamp(14px,2.2vw,18px)] leading-[1.45]
            sm:mt-4
          "
        >
          {t("hero.description")}
        </p>
      </div>
    </section>
  );
};

export default AboutHero;