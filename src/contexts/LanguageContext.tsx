"use client";
import { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from "react";

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

  const toggleLang = useCallback(() => {
    setLang(prev => {
      const next = prev === "th" ? "en" : "th";
      localStorage.setItem("sp-lang", next);
      return next;
    });
  }, []);

  const t = useCallback((th: string, en: string) => (lang === "th" ? th : en), [lang]);
  const tPreMount = useCallback((th: string) => th, []);

  // Use default "th" until mounted to match SSR output and avoid hydration mismatch
  const value = useMemo(
    () => (mounted ? { lang, toggleLang, t } : { lang: "th" as Lang, toggleLang, t: tPreMount }),
    [mounted, lang, toggleLang, t, tPreMount]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
