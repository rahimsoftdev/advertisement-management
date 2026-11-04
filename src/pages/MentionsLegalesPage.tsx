import React from "react";
import { useTranslation } from "react-i18next";
import {
  FiShield,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiSlash,
  FiMail,
} from "react-icons/fi";

const bullets = [1, 2, 3, 4, 5];

const rights = [
  { key: "card1", icon: FiEye },
  { key: "card2", icon: FiEdit2 },
  { key: "card3", icon: FiTrash2 },
  { key: "card4", icon: FiSlash },
] as const;

const NumberBadge: React.FC<{ n: number }> = ({ n }) => (
  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-myprimary/15 text-sm font-semibold text-myprimary">
    {n}
  </span>
);

const Card: React.FC<{
  number: number;
  title: string;
  children: React.ReactNode;
}> = ({ number, title, children }) => (
  <div className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
    <div className="flex items-start gap-3">
      <NumberBadge n={number} />
      <div className="min-w-0 flex-1">
        <h2 className="mb-1.5 text-lg font-semibold text-primaryText sm:text-xl">
          {title}
        </h2>
        <div className="space-y-2.5 text-xs leading-relaxed text-secondaryText sm:text-sm">
          {children}
        </div>
      </div>
    </div>
  </div>
);

export default function PrivacyPolicyPage(): React.JSX.Element {
  const { t } = useTranslation("legal");

  return (
    <div className="min-h-screen w-full bg-[#FAF9F7]">
      <div className="pb-10 pt-10 sm:pt-12 lg:pt-18 sm:pb-12 lg:pb-section">
        <div className="container mx-auto px-4 lg:px-10">
          <div className="">
            {/* Title */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-primaryText sm:text-3xl lg:text-4xl">
                {t("title")}
              </h1>
              <p className="mt-2 text-xs text-secondaryText sm:text-sm">
                {t("date")}
              </p>
            </div>

            {/* All sections share the same gap */}
            <div className="space-y-5 sm:space-y-6">
              {/* GDPR intro */}
              <div className="flex items-start gap-3 rounded-lg border-l-4 border-myprimary bg-myprimary/10 p-4 sm:p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-myprimary/20 text-myprimary">
                  <FiShield />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="mb-1 text-lg font-semibold text-primaryText sm:text-xl">
                    {t("section1.title")}
                  </h2>
                  <p className="text-xs leading-relaxed text-secondaryText sm:text-sm">
                    {t("section1.description")}
                  </p>
                </div>
              </div>

              {/* 1 */}
              <Card number={1} title={t("section2.title")}>
                <p>{t("section2.description")}</p>
              </Card>

              {/* 2 */}
              <Card number={2} title={t("section3.title")}>
                <p>{t("section3.description")}</p>
                <ul className="list-disc space-y-1.5 pl-5">
                  {bullets.map((b) => (
                    <li key={b}>{t(`section3.bullet${b}`)}</li>
                  ))}
                </ul>
              </Card>

              {/* 3 */}
              <Card number={3} title={t("section4.title")}>
                <p>{t("section4.description")}</p>
                <div className="rounded-md bg-[#FAF3DC] px-4 py-2.5 text-xs font-medium text-primaryText sm:text-sm">
                  {t("section4.highlight")}
                </div>
                <p>{t("section4.footer")}</p>
              </Card>

              {/* 4 */}
              <Card number={4} title={t("section5.title")}>
                <p>{t("section5.description")}</p>
              </Card>

              {/* 5 */}
              <Card number={5} title={t("section6.title")}>
                <p>{t("section6.description")}</p>
              </Card>

              {/* 6 */}
              <Card number={6} title={t("section7.title")}>
                <p>{t("section7.description")}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {rights.map(({ key, icon: Icon }) => (
                    <div
                      key={key}
                      className="rounded-md border border-gray-200 bg-[#FAF9F7] p-3 sm:p-4"
                    >
                      <div className="mb-1 flex items-center gap-2 text-sm font-medium text-primaryText">
                        <Icon className="shrink-0 text-myprimary" />
                        {t(`section7.${key}_title`)}
                      </div>
                      <p className="text-xs leading-relaxed text-secondaryText">
                        {t(`section7.${key}_desc`)}
                      </p>
                    </div>
                  ))}
                </div>
                <p>{t("section7.footer")}</p>
              </Card>

              {/* 7 */}
              <Card number={7} title={t("section8.title")}>
                <p>{t("section8.description")}</p>
              </Card>

              {/* 8 */}
              <Card number={8} title={t("section9.title")}>
                <p>{t("section9.description")}</p>
              </Card>

              {/* Contact */}
              <div className="rounded-xl bg-myprimary p-4 text-white shadow-sm sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white text-myprimary">
                    <FiMail />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="mb-1 text-lg font-semibold sm:text-xl">
                      {t("contact.title")}
                    </h2>
                    <p className="mb-3 text-xs leading-relaxed !text-white/90 sm:text-sm">
                      {t("contact.description")}
                    </p>
                    <button
                      type="button"
                      className="cursor-pointer rounded-md bg-white px-3.5 py-2 text-xs font-medium text-myprimary transition-all duration-200 hover:bg-white/90 active:scale-95 sm:text-sm"
                    >
                      {t("contact.button")}
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer note */}
              <div className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm sm:p-5">
                <FiShield className="mt-0.5 shrink-0 text-secondaryText" />
                <p className="text-xs leading-relaxed text-secondaryText sm:text-sm">
                  {t("footer_note")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}