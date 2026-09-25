'use client';

import { useLang } from "@/app/context/LanguageContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/app/utils/supabase/client";

const signInTranslation = {
    ar: {
        title: 'اهلا بعودتك !',
        emailLabel: 'ايميل',
        emailPlaceHolder: 'example@gmail.com',
        passwordLabel: 'كلمة السر',
        passwordPlaceHolder: 'ادخل كلمة السر',
        submitButton: 'تسجيل دخول',
        fillFields: '* الرجاء ملء جميع الحقول',
    },
    en: {
        title: 'Welcom Back !',
        emailLabel: 'Email',
        emailPlaceHolder: 'example@gmail.com',
        passwordLabel: 'Password',
        passwordPlaceHolder: 'Enter your password',
        submitButton: 'Sign In',
        fillFields: '* Please fill out all the fields',
    }
}

function SignIn() {
    const [supabase] = useState(() => createClient());
    const { lang } = useLang();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setEroor] = useState<string | null>('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const t = signInTranslation[lang];
    const isAr = lang === "ar";

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (email.trim() === '' || password.trim() === '') {
            setEroor(t.fillFields);
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            setEroor('* ' + error.message);
            setLoading(false);
        } else {
            setEmail('');
            setPassword('');
            setEroor(null);
            router.push('/pages/main');
        }
    }

    return (
        <div
            dir={isAr ? 'rtl' : 'ltr'}
            className="font-arabic flex flex-col justify-center items-center bg-linear-to-br from-emerald-50 to-teal-100 min-h-screen w-full">
            <form className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md" onSubmit={handleSubmit}>
                <h1 className="text-4xl font-bold text-teal-700 text-center mb-6">{t.title}</h1>
                <div className="flex flex-col justify-center w-full">
                    <label htmlFor="email" className="font-arabic text-xl text-gray-600 leading-relaxed">{t.emailLabel}</label>
                    <input
                        id="email"
                        type="email"
                        placeholder={t.emailPlaceHolder}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2  rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none" />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="font-arabic text-xl text-gray-600 leading-relaxed">{t.passwordLabel}</label>
                    <input
                        id="password"
                        type="password"
                        placeholder={t.passwordPlaceHolder}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2  rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none" />
                </div>
                <p className="font-semibold text-red-500">{error}</p>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full items-center mt-2 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-arabic font-medium py-2.5 px-8 rounded-full text-lg transition-all hover:scale-105 cursor-pointer"
                >
                    {t.submitButton}
                </button>
            </form>
        </div>
    );
}

export default SignIn;