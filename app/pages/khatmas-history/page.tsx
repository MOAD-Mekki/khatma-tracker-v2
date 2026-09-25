'use client';

import { createClient } from "@/app/utils/supabase/client";
import { useLang } from "@/app/context/LanguageContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
        loading: 'جاري التحميل...',
        noKhatmas: 'لم تكمل اي ختمة بعد، ابدا الان !',
        return: 'العودة الى الصفحة الرئيسية'
    },
    en: {
        khatmashistory: 'Khatmas History',
        khatma: 'Khatma',
        started: 'Started at :',
        finished: 'Finished at: ',
        duration: 'Duration :',
        days: 'Days',
        inProgress: 'In Progress',
        loading: 'Loading...',
        noKhatmas: "You haven't completed any khatmas yet, Start Now !",
        return: 'Back to main page'
    }
}

interface Khatma {
    id: string,
    started_at: string,
    finished_at: string | null,
}

export default function KhatmasHistory(){
    const [supabase] = useState(() => createClient());
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [khatmas, setKhatmas] = useState<Khatma[]>([]);
    const [loading, setLoading] = useState(true);
    const { lang } = useLang();
    const isAr = lang === "ar";
    const t = khatmaHistoryTranslation[lang];

    // Handling user authentication.
    useEffect(() => {
        const initAuth = async () => {
            const { data: { user: existingUser } } = await supabase.auth.getUser();
            if (existingUser) setUser(existingUser);
        };

        initAuth();

        // Making sure that the subscribtion continue all the time, if not redirects to /
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);

                if (!session?.user) {
                    router.push("/");
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [supabase, router]);

    // History Loading handler.
    useEffect(() => {
        if (!user) return;

        const loadHistory = async () => {
            const { data, error } = await supabase
                .from("khatmas")
                .select("*")
                .eq("user_id", user.id)
                .order("started_at", { ascending: true });

            if (error) {
                console.error("Failed to load khatma history:", error.message);
            } else if (data) {
                setKhatmas(data);
            }

            setLoading(false);
        };

        loadHistory();
    }, [user, supabase]);

    // The Pre-Loading UI
    if (!user || loading) {
        return (
            <div
                dir={isAr ? 'rtl' : 'ltr'}
                className="font-arabic flex flex-col items-center justify-center bg-linear-to-br from-emerald-50 to-teal-100 min-h-screen w-full"
            >
                <p className="text-teal-700 text-lg animate-pulse">{t.loading}</p>
            </div>
        );
    }

    return (
        <div dir={isAr ? 'rtl' : 'ltr'} className="font-arabic flex flex-col bg-linear-to-br from-emerald-50 to-teal-100 min-h-screen w-full">
            <div className="flex-1 flex items-center justify-center px-4 py-10">
                <div className="flex flex-col justify-center items-center border border-teal-200 rounded-2xl w-full max-w-md p-8 bg-white/80 backdrop-blur-sm shadow-lg text-center gap-5">
                    <h1 className="font-arabic text-4xl font-bold text-teal-700">
                        {t.khatmashistory}
                    </h1>

                    {khatmas.length === 0 ? (
                        <p className="text-gray-500 text-base">{t.noKhatmas}</p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {khatmas.map((k, idx) => (
                                <div key={k.id} className="bg-white shadow rounded-xl p-4">
                                    <p className="font-bold text-teal-600">{t.khatma} #{idx + 1}</p>
                                    <p className="font-arabic text-lg text-gray-600 leading-relaxed">
                                        {t.started} {new Date(k.started_at).toLocaleDateString()}
                                    </p>
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
                    )}

                    <button 
                        onClick={(e) => router.push('/pages/main')}
                        className="mt-2 bg-teal-500 hover:bg-teal-600 text-white font-arabic font-medium py-2.5 px-8 rounded-full text-sm transition-all hover:scale-105 cursor-pointer">
                            {t.return}
                    </button>
                </div>
            </div>
        </div>
    )
}