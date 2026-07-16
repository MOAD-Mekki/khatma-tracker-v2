'use client';

import Link from "next/link";
import { useLang } from "./context/LanguageContext";

const welcomeTranslations = {
  ar: {
    title: "متتبع الختمة",
    description:
      "تابع ختمتك للقرآن الكريم بسهولة — سجّل حفظك جزءاً بجزء أو حزباً بحزب، وشاهد تقدمك حتى تكتمل الختمة.",
    signIn: "لديك حساب ؟",
    signUp: "انشاء حساب"
  },
  en: {
    title: "Khatma Tracker",
    description:
      "Track your Quran completion easily — mark your progress hizb by hizb or juz by juz, and watch it grow until the khatma is complete.",
    signIn: "Got an Account?",
    signUp: "Sign Up"
  },
};

export default function Home() {
  const { lang } = useLang();
  const t = welcomeTranslations[lang];
  const isAr = lang === "ar";


  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="font-arabic flex flex-col bg-linear-to-br from-emerald-50 to-teal-100 min-h-screen w-full"
    >

      {/* This grows to fill remaining height and centers the card */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div
          className="flex flex-col justify-center items-center border border-teal-200 rounded-2xl w-full max-w-md p-8 bg-white/80 backdrop-blur-sm shadow-lg text-center gap-5"
        >
          <h1 className="font-arabic text-4xl font-bold text-teal-700">
            {t.title}
          </h1>
          <p className="font-arabic text-lg text-gray-600 leading-relaxed">
            {t.description}
          </p>
          <div className="min-w-full min-h-full flex flex-row">
            <Link href='/pages/signin' className="w-full">
              <button
                className="mt-2 bg-teal-500 hover:bg-teal-600 text-white font-arabic font-medium py-2.5 px-8 rounded-full text-lg transition-all hover:scale-105 cursor-pointer"
              >
                {t.signIn}
              </button>
            </Link>
            <Link href='/pages/signup' className="w-full">
              <button
                className="mt-2 bg-teal-500 hover:bg-teal-600 text-white font-arabic font-medium py-2.5 px-8 rounded-full text-lg transition-all hover:scale-105 cursor-pointer"
              >
                {t.signUp}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}