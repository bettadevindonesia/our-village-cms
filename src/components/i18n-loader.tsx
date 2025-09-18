"use client";

import { useEffect, useState } from "react";
import i18n from "@/app/i18n";

export function I18nReady({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
}) {
  const [ready, setReady] = useState(i18n.isInitialized);

  useEffect(() => {
    if (!ready) {
      i18n.on("initialized", () => setReady(true));
    }
  }, [ready]);

  return (
    <div suppressHydrationWarning>
      {!ready ? fallback : children}
    </div>
  );
}
