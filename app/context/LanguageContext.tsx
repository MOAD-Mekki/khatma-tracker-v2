'use client';

import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";
import { User } from "@supabase/supabase-js";

interface LangProp {
  children: React.ReactNode
}

interface Context {
  lang: "ar" | "en",
  setLang: (v: "ar" | "en") => void,
  toggle: () => void
}

const LanguageContext = createContext<Context | null>(null);

export function LanguageProvider({ children }: LangProp) {
  const [supabase] = useState(() => createClient());
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const applyUser = (u: User | null) => {
      setUser(u);

      const metadataLang = u?.user_metadata?.language;
      if (metadataLang === "ar" || metadataLang === "en") {
        setLang(metadataLang);
      }
    };

    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (!error) applyUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        applyUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const toggle = async () => {
    const newLang = lang === "ar" ? "en" : "ar";
    setLang(newLang);

    if (!user) return;

    const { error } = await supabase.auth.updateUser({
      data: { language: newLang },
    });

    if (error) {
      console.error("Failed to save language preference:", error.message);
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang(): Context {
  const context = useContext<Context | null>(LanguageContext);

  if (!context) {
    throw new Error("useLang must be used within a LanguageProvider");
  }

  return context;
}