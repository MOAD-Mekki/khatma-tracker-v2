'use client';

import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";

interface LangProp {
  children: React.ReactNode
}

interface Context {
  lang: "ar" | "en",
  setLang: (v: "ar" | "en") => void,
  toggle: () => void
}

const LanguageContext = createContext<Context | null>(null);


export function LanguageProvider({ children } : LangProp) {
  const supabase = createClient();
  const [lang, setLang] = useState<"ar" | "en">("ar");

  useEffect(() => {
    const loadLang = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!error && user?.user_metadata?.language) {
        setLang(user.user_metadata.language as "ar" | "en");
      }
    };
    loadLang();
  }, [supabase]);

  const toggle = () => setLang((l) => (l === "ar" ? "en" : "ar"));

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() : Context {
  const context =  useContext<Context | null>(LanguageContext);

    return context as Context;
}
