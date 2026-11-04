
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// French
import frCommon from "./locales/fr/common.json";
import frHome from "./locales/fr/home.json";
import frPricing from "./locales/fr/pricing.json";
import frAuth from "./locales/fr/auth.json";
import frAbout from "./locales/fr/about.json";
import frhowwork from "./locales/fr/howwoork.json";



// English
import enCommon from "./locales/en/common.json";
import enHome from "./locales/en/home.json";
import enPricing from "./locales/en/pricing.json";
import enAuth from "./locales/en/auth.json";
import enAbout from "./locales/en/about.json";
import enhowwork from "./locales/en/howwoork.json";

// Bangla
import bnCommon from "./locales/bn/common.json";
import bnHome from "./locales/bn/home.json";
import bnPricing from "./locales/bn/pricing.json";
import bnAuth from "./locales/bn/auth.json";
import bnAbout from "./locales/bn/about.json";
import bnhowwork from "./locales/bn/howwoork.json";



// Get saved language
const savedLanguage = localStorage.getItem("i18nextLng");

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: {
        common: frCommon,
        home:frHome,
        pricing:frPricing,
        auth:frAuth,
        about:frAbout,
        howwork:frhowwork

      },
      en: {
        common: enCommon,
        home:enHome,
        pricing:enPricing,
        auth:enAuth,
        about:enAbout,
        howwork:enhowwork
      },
      bn: {
        common: bnCommon,
        home:bnHome,
        pricing:bnPricing,
        auth:bnAuth,
        about:bnAbout,
        howwork:bnhowwork
      },
    },

    lng: savedLanguage || "fr",
    fallbackLng: "fr",

    supportedLngs: ["fr", "en", "bn"],

    defaultNS: "common",

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
