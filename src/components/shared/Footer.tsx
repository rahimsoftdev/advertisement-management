import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { FiAward, FiShield } from "react-icons/fi";
import { FaRegCopyright } from "react-icons/fa";
import logoImg from "../../assets/images/logo.png";

const Footer: React.FC = () => {
  const { t } = useTranslation("common");

  const linkClass =
    "inline-block py-0.5 text-[13px] !text-white transition-opacity duration-200 hover:underline hover:underline-offset-4 hover:opacity-80 sm:text-sm";

  const quickLinks = [
    { name: t("footer.home"), path: "/" },
    { name: t("footer.pricing"), path: "/pricing" },
    { name: t("footer.about"), path: "/about" },
    { name: t("footer.legal"), path: "/legal" },
  ];

  const supportLinks = [
    { name: t("footer.login"), path: "/login" },
    { name: t("footer.privacy"), path: "/privacy" },
    { name: t("footer.terms"), path: "/terms" },
  ];

  return (
    <footer className="bg-myprimary text-white">
      {/* Top Grid Sections */}
      <div className="container mx-auto px-4 lg:px-10 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-12 lg:pt-14">
        <div className=" grid  grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {/* Column 1: Brand Logo & Badges */}
          <div className="space-y-5 sm:col-span-2 lg:col-span-1">
            <Link to="/" aria-label="Home" className="inline-flex items-center">
              <img
                src={logoImg}
                alt="Casagen Logo"
                className="h-8 w-auto object-contain brightness-0 invert sm:h-9"
              />
            </Link>

            <p className="max-w-xs font-poppins text-[13px] leading-relaxed !text-white sm:text-sm">
              {t("footer.description")}
            </p>

            <div className="max-w-xs space-y-3">
              {/* Badge 1: translucent */}
              <div className="flex items-start gap-3 rounded-lg bg-white/15 p-3 text-xs font-medium leading-snug text-white backdrop-blur-md">
                <FiAward className="mt-0.5 shrink-0 text-base text-white" />
                <span className="font-poppins !text-white">{t("footer.badge1")}</span>
              </div>

              {/* Badge 2: solid white */}
              <div className="flex items-start gap-3 rounded-lg bg-white p-3 text-xs font-medium leading-snug text-myprimary shadow-sm">
                <FiShield className="mt-0.5 shrink-0 text-base" />
                <span className="font-poppins">{t("footer.badge2")}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <nav aria-label={t("footer.quickLinksTitle")}>
            <h3 className="mb-4 max-w-[14rem] text-base font-medium leading-snug !text-white sm:text-lg">
              {t("footer.quickLinksTitle")}
            </h3>
            <ul className="space-y-1.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className={linkClass}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3: Support and Legal Information */}
          <nav aria-label={t("footer.supportTitle")}>
            <h3 className="mb-4 max-w-[14rem] text-base font-medium leading-snug !text-white sm:text-lg">
              {t("footer.supportTitle")}
            </h3>
            <ul className="space-y-1.5">
              {supportLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className={linkClass}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom Copyright Section (full-width divider) */}
      <div className="border-t border-white/20">
        <div className="container mx-auto flex items-center justify-center gap-1.5 px-4 py-4 text-center text-[11px] text-white sm:text-xs">
          <FaRegCopyright className="shrink-0 text-white" aria-hidden="true" />
          <p className="!text-white">{t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;