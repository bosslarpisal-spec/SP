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

  useEffect(() => {
    const saved = localStorage.getItem("sp-lang") as Lang;
    if (saved === "th" || saved === "en") setLang(saved);
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

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
