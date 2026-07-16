'use client';

import { useState, useEffect } from "react";
import Card from "./../../components/HizbCard";
import CongratsCard from "./../../components/CongratsCard";
import Footer from "./../../components/Footer";
import { translations } from "./../../uses/translation";
import { ahadith } from "./../../uses/ahadith";
import { useLang } from "../../context/LanguageContext";
import initialAhzab from "@/app/uses/initialAhzab";
import initialAjzaa from "@/app/uses/initialAjzaa";
import { createClient } from "@/app/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

  interface Hizb {
    id: number,
    title: string,
    completed: boolean
  };

  interface ProgressRow {
  user_id: string;
  ahzab: number[];
  ajzaa: number[];
  khatma_count: number;
  updated_at: string;
};

export default  function Main() {
  // Keep ONE stable client for the component's lifetime instead of
  // creating a brand-new one on every render — that instability was
  // making the effects below re-fire more than intended.
  const [supabase] = useState(() => createClient());

  const [user, setUser] = useState<User | null>(null);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [ahzab, setAhzab] = useState<Hizb[]>(initialAhzab);
  const [ajzaa, setAjzaa] = useState<Hizb[]>(initialAjzaa);
  const [khatmaCount, setKhatmaCount] = useState(0);
  const [showResetModal, setShowResetModal] = useState(false);
  const [viewMode, setViewMode] = useState<"hizb" | "juz">("hizb");
  const [showCongrats, setShowCongrats] = useState(false);
  const [hadith, setHadith] = useState<string>("");
  const { lang } = useLang();
  const isAr = lang === "ar";

  // Get the current user, or silently create an anonymous one if this
  // is a brand-new visitor. Without this fallback, `user` stays null
  // forever for anyone who hasn't manually signed up, and every DB
  // call below ends up sending "undefined" as the user id.
  useEffect(() => {
    const initAuth = async () => {
      const { data: { user: existingUser } } = await supabase.auth.getUser();

      if (existingUser) {
        setUser(existingUser);
        return;
      }

    };

    initAuth();

    // keep `user` in sync with ANY later change to the session — signing
    // in as a real user, signing out, an anonymous account getting
    // upgraded, or a token refresh. This is what was missing: without
    // it, `user` goes stale the moment the session changes and every
    // DB call after that uses the wrong id.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
     if (!user) return;

    const newKhatmaStarts = async () => {

      if (khatmaCount === 0) {
        await supabase.from("khatmas").insert({
          user_id: user?.id,
          started_at: new Date().toISOString()
        });
      }
    }

    newKhatmaStarts();
  }, [user, khatmaCount]);

  // Load saved progress once we actually have a user. maybeSingle()
  // (not single()) so a brand-new user with no row yet doesn't throw.
  useEffect(() => {
    if (!user) return;

    const loadProgress = async () => {
      const { data: progress, error } = await supabase
        .from("khatma_progress")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle<ProgressRow>();

      if (error) {
        console.error("loading error:", error.message);
      } else if (progress) {
        setAhzab(
          initialAhzab.map((h) => ({
            ...h,
            completed: (progress.ahzab || []).includes(h.id),
          })),
        );
        setAjzaa(
          initialAjzaa.map((j) => ({
            ...j,
            completed: (progress.ajzaa || []).includes(j.id),
          })),
        );
        setKhatmaCount(progress.khatma_count || 0);
      }
      // progress === null just means this user has no saved row yet —
      // the initial state (all incomplete, count 0) is already correct.

      setProgressLoaded(true);
    };

    loadProgress();
  }, [user, supabase]);

  // Debounced autosave — the single place that writes progress to the
  // DB. Waits for progressLoaded so it can never fire before the load
  // above finishes (which would silently overwrite a returning user's
  // real saved progress with the blank initial state).
  useEffect(() => {
    if (!user || !progressLoaded) return;

    const saveProgress = async () => {
      const completedAhzab = ahzab.filter((h) => h.completed).map((h) => h.id);
      const completedAjzaa = ajzaa.filter((j) => j.completed).map((j) => j.id);

      const { error } = await supabase.from("khatma_progress").upsert(
        {
          user_id: user.id,
          ahzab: completedAhzab,
          ajzaa: completedAjzaa,
          khatma_count: khatmaCount,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

      if (error) console.error("saving error:", error.message);
    };

    const timeout = setTimeout(saveProgress, 500); // debounce fast toggles
    return () => clearTimeout(timeout);
  }, [ahzab, ajzaa, khatmaCount, user, progressLoaded, supabase]);

  // toggle between hizb and juz rendering
  async function toggleItem(id: number, type: "hizb" | "juz") {
  if (type === "hizb") {
    const updated = ahzab.map(h =>
      h.id === id ? { ...h, completed: !h.completed } : h
    );
    setAhzab(updated);

    if (updated.every(h => h.completed)) {
      setKhatmaCount(c => c + 1);
      setShowCongrats(true);

      await supabase.from("khatmas")
        .update({ finished_at: new Date().toISOString() })
        .eq("user_id", user?.id)
        .is("finished_at", null);

      // Immediately start a new khatma row
      await supabase.from("khatmas").insert({
        user_id: user?.id,
        started_at: new Date().toISOString()
      });
    }
  } else {
    const updated = ajzaa.map(j =>
      j.id === id ? { ...j, completed: !j.completed } : j
    );
    setAjzaa(updated);

    if (updated.every(j => j.completed)) {
      setKhatmaCount(c => c + 1);
      setShowCongrats(true);

      await supabase.from("khatmas")
        .update({ finished_at: new Date().toISOString() })
        .eq("user_id", user?.id)
        .is("finished_at", null);

      await supabase.from("khatmas").insert({
        user_id: user?.id,
        started_at: new Date().toISOString()
      });
    }
  }
}

  // Reset khatma counter — just updates state; the autosave effect
  // above persists it (and creates the row if one doesn't exist yet,
  // which the old direct .update() call would have silently skipped).
  async function handleReset() {
    setAhzab(initialAhzab);
    setAjzaa(initialAjzaa);
    setKhatmaCount(0);
    setShowResetModal(false);

    await supabase.from("khatmas").insert({
      user_id: user?.id,
      started_at: new Date().toISOString()
  });
  }

  // New khatma handler after the congrats card — same idea, no direct
  // DB call needed here anymore.
  async function handleNewKhatma() {
    setAhzab(initialAhzab);
    setAjzaa(initialAjzaa);
    setShowCongrats(false);

    await supabase.from('khatmas').insert({
      user_id: user?.id,
      started_at: new Date().toISOString()
    });
  }

  const list = viewMode === "hizb" ? ahzab : ajzaa;

  // translation object
  const t = translations[lang];

  // handling ahadith rendering
  useEffect(() => {
    const random = Math.floor(Math.random() * 10);
    setHadith(ahadith[random].content);
  }, []);


  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="font-arabic flex flex-col gap-5 justify-center items-center bg-linear-to-br from-emerald-50 to-teal-100 max-w-full h-full"
    >


      {/* // The page Header */}
      <header className="flex flex-col gap-5 justify-center items-center mt-10">
        <h1 className="font-arabic text-4xl font-bold text-teal-700 text-center leading-snug">
          <span className="block text-sm font-sans tracking-widest text-teal-400 mb-1">
            {t.pageSubtitle}
          </span>
          {t.pageTitle}
        </h1>
        <p
          dir="rtl"
          className="font-arabic text-base text-gray-600 text-center leading-loose max-w-md"
        >
          {hadith}
        </p>
        <div className="bg-white border border-teal-200 rounded-2xl px-10 py-4 text-center shadow-sm">
          <p className="font-arabic text-4xl font-bold text-teal-700 leading-none">
            {khatmaCount}
          </p>
          <p className="font-sans text-xs text-gray-400 mt-1 tracking-wide">
            {t.khatmaCount}
          </p>
          <Link href={'/pages/khatmas-history'}>
            <button className="mt-1 bg-teal-300 hover:bg-teal-400 text-white font-arabic font-medium py-2 px-4 rounded-full text-sm transition-all hover:scale-105 cursor-pointer">
              {t.khatmashistory}
            </button>
          </Link>
        </div>
      </header>

      {/* // View type container */}
      <section className="flex flex-row gap-3 mt-6">
        <button
          className={`font-arabic font-medium rounded-full text-base px-6 py-2.5 transition-all hover:scale-105 hover:cursor-pointer
      ${
        viewMode === "hizb"
          ? "bg-teal-700 text-white shadow-md"
          : "bg-white text-teal-700 border border-teal-500 hover:bg-teal-50"
      }`}
          onClick={() => setViewMode("hizb")}
        >
          {t.viewByHizb}
        </button>
        <button
          className={`font-arabic font-medium rounded-full text-base px-6 py-2.5 transition-all hover:scale-105 hover:cursor-pointer
      ${
        viewMode === "juz"
          ? "bg-teal-700 text-white shadow-md"
          : "bg-white text-teal-700 border border-teal-500 hover:bg-teal-50"
      }`}
          onClick={() => setViewMode("juz")}
        >
          {t.viewByJuz}
        </button>
      </section>

      {/* // Cards container */}
      <section className="grid grid-cols-3 lg:grid-cols-8 md:grid-cols-5 grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)) justify-around gap-6 my-10">
        {list.map((item) => (
          <Card
            key={item.id}
            {...item}
            onClick={() => toggleItem(item.id, viewMode)}
          />
        ))}
      </section>
      <div className="my-10">

        {/* // Reset */}
        <button
          className="text-white bg-linear-to-r from-red-400 via-red-500 to-red-600 hover:scale-105 hover:cursor-pointer shadow-lg font-medium rounded-full text-base px-5 py-2.5 transition-transform"
          onClick={() => setShowResetModal(true)}
        >
          {t.reset}
        </button>
      </div>

        {/* // Footer adding */}
      <Footer />

      {/* // Reset verefication card */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 flex flex-col items-center gap-4 shadow-xl text-center">
            <div className="text-4xl">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800">
              {t.resetConfirmTitle}
            </h2>
            <p className="text-gray-500 text-base leading-relaxed">
              {t.resetConfirmBody}
            </p>
            <div className="flex gap-3 w-full mt-2">
              <button
                className="flex-1 bg-red-500 text-white font-medium py-2.5 rounded-xl hover:bg-red-600 transition-colors"
                onClick={handleReset}
              >
                {t.resetYes}
              </button>
              <button
                className="flex-1 bg-gray-100 text-gray-700 font-medium py-2.5 rounded-xl hover:bg-gray-200 transition-colors"
                onClick={() => setShowResetModal(false)}
              >
                {t.resetCancel}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* // Congrats Card */}
      {showCongrats && (
        <CongratsCard
          khatmaCount={khatmaCount}
          onNewKhatma={handleNewKhatma}
          t={t}
        />
      )}
    </div>
  );
}
