
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// French
import frCommon from "./locales/fr/common.json";
import frHome from "./locales/fr/home.json";
import frPricing from "./locales/fr/pricing.json";
import frAuth from "./locales/fr/auth.json";


// English
import enCommon from "./locales/en/common.json";
import enHome from "./locales/en/home.json";
import enPricing from "./locales/en/pricing.json";
import enAuth from "./locales/en/auth.json";

// Bangla
import bnCommon from "./locales/bn/common.json";
import bnHome from "./locales/bn/home.json";
import bnPricing from "./locales/bn/pricing.json";
import bnAuth from "./locales/bn/auth.json";



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
        auth:frAuth

      },
      en: {
        common: enCommon,
        home:enHome,
        pricing:enPricing,
        auth:enAuth
      },
      bn: {
        common: bnCommon,
        home:bnHome,
        pricing:bnPricing,
        auth:bnAuth
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
