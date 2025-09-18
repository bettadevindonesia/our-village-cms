"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

if (!i18n.isInitialized) {
  i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: "id",
      supportedLngs: ["en", "id"],
      defaultNS: "login",
      ns: ["login", "sidebar", "dashboard"],
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
      },
      backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json",
      },
      react: {
        bindI18n: 'loaded languageChanged',
        bindI18nStore: 'added',
        useSuspense: true,
      },
    });
}

export default i18n;
