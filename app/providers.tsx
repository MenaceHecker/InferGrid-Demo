"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { SplashScreen } from "@/components/splash-screen";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SplashScreen />
      {children}
    </ThemeProvider>
  );
}
