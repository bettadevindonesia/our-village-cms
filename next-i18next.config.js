import path from "path";

const configLocale = {
  i18n: {
    defaultLocale: "id",
    locales: ["en", "id"],

    localePath: path.resolve("./public/locales"),
  },

  reloadOnPrerender: process.env.NODE_ENV === "development",
};

export default configLocale;
