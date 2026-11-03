
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// French
import frCommon from "./locales/fr/common.json";
import frHome from "./locales/fr/home.json";

// English
import enCommon from "./locales/en/common.json";
import enHome from "./locales/en/home.json";

// Bangla
import bnCommon from "./locales/bn/common.json";
import bnHome from "./locales/bn/home.json";

// Get saved language
const savedLanguage = localStorage.getItem("i18nextLng");

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: {
        common: frCommon,
        home:frHome

      },
      en: {
        common: enCommon,
        home:enHome
      },
      bn: {
        common: bnCommon,
        home:bnHome
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
