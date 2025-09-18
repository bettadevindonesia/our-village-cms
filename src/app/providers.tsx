"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div suppressHydrationWarning>{children}</div>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default Providers;
