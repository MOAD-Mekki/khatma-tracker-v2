'use client';

import { useEffect, useState } from "react";
import { useLang } from "../context/LanguageContext";
import Link from "next/link";

const navTranslations = {
  ar: {
    browseQuran: "تصفح المصحف",
    langBtn: "EN",
  },
  en: {
    browseQuran: "Browse Quran",
    langBtn: "ع",
  },
};


export default function Navbar() {
  
  const [hijriDate, setHijriDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [miladiDate, setmiladiDate] = useState<string>('');
  const { lang, toggle } = useLang();
  const t = navTranslations[lang];
  const isAr = lang === "ar";

  useEffect(() => {
    const interval = setInterval(() => setTime(getTime()), 1000);

    function getHijriDate(lang : "ar" | "en") {
      try {
        return new Intl.DateTimeFormat(
          lang === "ar" ? "ar-SA-u-ca-islamic" : "en-SA-u-ca-islamic",
          { day: "numeric", month: "long", year: "numeric" }
        ).format(new Date());
      } catch {
        return "";
      }
    }

    function getMiladiDate() {
      return new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    function getTime() {
      return new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }

    setHijriDate(getHijriDate(lang));
    setmiladiDate(getMiladiDate());
    setTime(getTime());
    return () => clearInterval(interval);
  }, []);

  return (
    <nav
      dir={isAr ? "rtl" : "ltr"}
      className=" sticky top-0 z-50 w-full bg-white/85 backdrop-blur-md border-b border-teal-100"
      style={{ boxShadow: "0 1px 12px rgba(13,148,136,0.07)" }}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Browse Quran */}
        <a
          href="https://quran.com"
          target="_blank"
          rel="noreferrer"
          className="sm:flex items-center gap-1.5 bg-white border-2 border-teal-200 hover:bg-teal-100 text-teal-700 font-arabic text-sm px-4 py-2 rounded-full transition-all hover:scale-105 shrink-0"
        >
          <span>{t.browseQuran}</span>
        </a>

        {/* Date & time */}
        <div className="hidden sm:flex flex-col items-center bg-teal-50 border border-teal-100 rounded-xl  px-4 py-1.5 gap-0.5">
          <span className="font-arabic text-sm font-bold text-teal-700 leading-snug">
            {hijriDate}
          </span>
          <span className="font-sans text-[11px] text-gray-400 leading-snug">
            {miladiDate} — {time}
          </span>
        </div>

        {/* Mobile date & time (hijri only) */}
        <div className="sm:hidden flex flex-col items-center bg-teal-50 border border-teal-100 rounded-xl px-3 py-1">
          <span className="font-arabic text-xs font-bold text-teal-700 leading-snug">
            {hijriDate}
          </span>
        </div>

          <div className="flex flex-row justify-center items-center gap-3 ">
            {/* Language toggle */}
            <button
              onClick={toggle}
              className="bg-white border-2 border-teal-200 text-teal-700 font-sans font-semibold text-sm px-4 py-2 rounded-full hover:bg-teal-50 hover:scale-105 transition-all cursor-pointer shrink-0"
            >
              {t.langBtn}
            </button>
            <Link href={'/'}>
              <img src='/logo.svg' alt="logo" className=" h-full w-10 " />
            </Link>
          </div>
      </div>
    </nav>
  );
}