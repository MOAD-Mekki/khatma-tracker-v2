'use client';

import { useLang } from "../context/LanguageContext";
import { useState } from "react";
import { createClient } from "../utils/supabase/client";
import Contact from "./ContactCard";

const footerTranslations = {
  ar: {
    ayahRef: "المزمل 73:4",
    quranLink: "تصفح المصحف",
    bugReport: "الإبلاغ عن خطأ",
    contact: "تواصل معنا",
    signout: 'تسجيل الخروج',
    madeWith: "صُنع بـ ♥ ابتغاءًا لوجه الله",
    rights: "© 2026 متتبع الختمة | جميع الحقوق محفوظة",
  },
  en: {
    ayahRef: "Al-Muzzammil 73:4",
    quranLink: "Browse Quran",
    bugReport: "Report a bug",
    contact: "Contact Us",
    signout: 'Sign Out',
    madeWith: "Made with ♥ for the sake of Allah",
    rights: "© 2026 Khatma Tracker | All rights reserved",
  },
};

export default function Footer() {
  const supabase = createClient();
  const { lang } = useLang();
  const t = footerTranslations[lang];
  const isAr = lang === "ar";
  const [contact, setContact] = useState(false);

  const handleEmail = () => {
    window.location.href = "mailto:moadahmedabdesselammekki@gmail.com?subject=Reporting a Bug in the Khatma tracker project";
  };

  const handleSignOut = async () => {
    const {error} = await supabase.auth.signOut();

    if (error) {
      console.log('DB Error');
    } else {
      isAr ? alert('لقد تم تسجيل الخروج بنجاح ') : alert('Signed Out Successfully');

    }
  }

  return (
    <footer
      dir={isAr ? "rtl" : "ltr"}
      className="font-arabic w-full bg-white border-t border-teal-100 mt-10 px-6 py-8 flex flex-col items-center gap-5"
    >
        {/* {Ayah} */}
      <div className="text-center max-w-lg">
        <p dir="rtl" className="text-xl text-teal-700 leading-loose">﴿ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴾</p>
        <p className="font-sans text-xs text-gray-400 mt-1">{t.ayahRef}</p>
      </div>


        {/* {Links} */}
      <div className="flex flex-wrap justify-center items-center gap-4">
        {/* Bug Report */}
        <a
          onClick={handleEmail}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-800 hover:cursor-pointer transition-colors"
        >
            {t.bugReport}
        </a>
        <span className="w-1 h-1 rounded-full bg-gray-300" />
        {/* Contact Card */}
        <a
          onClick={() => setContact(true)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-800 hover:cursor-pointer transition-colors"
        >
            {t.contact}
        </a>
        <span className="w-1 h-1 rounded-full bg-gray-300" />
        {/* Sign Out */}
        <a 
          onClick={handleSignOut}
          className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-800 hover:cursor-pointer transition-colors">
            {t.signout}
        </a>
      </div>

        {/* {Bottom text} */}
      <div className="border-t border-teal-50 pt-4 w-full flex flex-col items-center gap-1">
        <p className="font-sans text-sm text-gray-400">{t.madeWith}</p>
        <p className="font-sans text-xs text-gray-300">{t.rights}</p>
      </div>

    {contact && (
        <Contact          
          lang={lang}
          onClose={() => setContact(false)}/>
      )}
    </footer>
  );
}