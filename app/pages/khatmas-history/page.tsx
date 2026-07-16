'use client';

import { createClient } from "@/app/utils/supabase/client";
import { useLang } from "@/app/context/LanguageContext";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";

const khatmaHistoryTranslation = {
    ar: {
        khatmashistory: 'ارشيف الختمات',
        khatma: 'ختمة ',
        started: 'بدات في  :',
        finished: 'اكتملت في :',
        duration: 'المدة :',
        days: ' ايام ',
        inProgress: 'قيد الاتمام ',
    },
    en: {
        khatmashistory: 'Khatmas History',
        khatma: 'Khatma',
        started: 'Started at :',
        finished: 'Finished at: ',
        duration: 'Duration :',
        days: 'Days',
        inProgress: 'In Progress',
    }
}

interface Khatma {
    id: string,
    started_at: string,
    finished_at: string | null,
}

export default function KhatmasHistory(){
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [khatmas, setKhatmas] = useState<Khatma[]>([]);
    const {lang} = useLang();
    const isAr = lang === "ar";
    const t = khatmaHistoryTranslation[lang];

    useEffect(() => {
    const initAuth = async () => {
      const { data: { user: existingUser } } = await supabase.auth.getUser();

      if (existingUser) {
        setUser(existingUser);
        return;
      }

    };

    initAuth();
    },[]);

    useEffect(() => {
        const loadHistory = async () => {
            if (!user) return;
            const { data, error } = await supabase
              .from("khatmas")
              .select("*")
              .eq("user_id", user.id)
              .order("started_at", { ascending: true });

            if (!error && data) setKhatmas(data);
        };

    loadHistory();
  }, [user]);

    return (
        <div dir={isAr ? 'rtl' : 'ltr'} className="font-arabic flex flex-col bg-linear-to-br from-emerald-50 to-teal-100 min-h-screen w-full">
            <div className="flex-1 flex items-center justify-center px-4 py-10">
                <div 
                    className="flex flex-col justify-center items-center border border-teal-200 rounded-2xl w-full max-w-md p-8 bg-white/80 backdrop-blur-sm shadow-lg text-center gap-5">
                        <h1 className="font-arabic text-4xl font-bold text-teal-700">
                            {t.khatmashistory}
                        </h1>
                        <div className="flex flex-col gap-4">
                            {khatmas.map((k, idx) => (
                                <div key={k.id} className="bg-white shadow rounded-xl p-4">
                                    <p className="font-bold text-teal-600" >{t.khatma} #{idx + 1}</p>
                                    <p className="font-arabic text-lg text-gray-600 leading-relaxed">{t.started} {new Date(k.started_at).toLocaleDateString()}</p>
                                    <p className="font-arabic text-lg text-gray-600 leading-relaxed">
                                        {t.finished} {k.finished_at
                                        ? new Date(k.finished_at).toLocaleDateString()
                                        : `${t.inProgress}`}
                                    </p>
                                    {k.finished_at && (
                                        <p className="font-arabic text-lg text-gray-600 leading-relaxed">
                                            {t.duration}{" "}
                                                {Math.ceil(
                                                    (new Date(k.finished_at).getTime() -
                                                        new Date(k.started_at).getTime()) /
                                                            (1000 * 60 * 60 * 24)
                                                )}{" "}
                                            {t.days}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                </div>
            </div>
        </div>
    )
}