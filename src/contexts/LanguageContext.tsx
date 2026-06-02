"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Lang = "th" | "en";
interface LangContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (th: string, en: string) => string;
}

const LanguageContext = createContext<LangContextType>({
  lang: "th",
  toggleLang: () => {},
  t: (th) => th,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("th");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sp-lang") as Lang;
    if (saved === "th" || saved === "en") setLang(saved);
    setMounted(true);
  }, []);

  function toggleLang() {
    setLang(prev => {
      const next = prev === "th" ? "en" : "th";
      localStorage.setItem("sp-lang", next);
      return next;
    });
  }

  function t(th: string, en: string) {
    return lang === "th" ? th : en;
  }

  // Use default "th" until mounted to match SSR output and avoid hydration mismatch
  const value = mounted ? { lang, toggleLang, t } : { lang: "th" as Lang, toggleLang, t: (th: string) => th };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
