'use client';

import { useLang } from "@/app/context/LanguageContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/app/utils/supabase/client";

const signUpTranslation = {
    ar: {
        title: 'انشاء حساب جديد',
        displayName: 'اسمك',
        displayNameLabel: 'الاسم',
        emailLabel: 'ايميل',
        emailPlaceHolder: 'example@gmail.com',
        passwordLabel: 'كلمة السر',
        passwordPlaceHolder: 'يجب ان تحتوي على الاقل 6 حروف',
        submitButton: 'انشاء حساب',
        fillFields: '* الرجاء ملىء جميع المجالات',
        passwordTooShort: '* كلمة السر يجب ان تحتوي على 6 حروف على الاقل',
        confirmEmail: 'تم إنشاء الحساب! الرجاء تفقد بريدك الإلكتروني لتأكيده قبل تسجيل الدخول.',
    },
    en: {
        title: 'Create New Account',
        displayName: 'your name',
        displayNameLabel: 'Name',
        emailLabel: 'Email',
        emailPlaceHolder: 'example@gmail.com',
        passwordLabel: 'Password',
        passwordPlaceHolder: 'password should at least contains 6 charachters',
        submitButton: 'Create Account',
        fillFields: '* Please fill out all the fields',
        passwordTooShort: '* Password must be at least 6 characters',
        confirmEmail: 'Account created! Please check your email to confirm before logging in.',
    }
}

function SignUp() {
    const [supabase] = useState(() => createClient());
    const { lang } = useLang();
    const [displayName, setDisplayName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setEroor] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const t = signUpTranslation[lang];
    const isAr = lang === "ar";
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (email.trim() === '' || password.trim() === '') {
            setEroor(t.fillFields);
            return;
        }

        if (password.length < 6) {
            setEroor(t.passwordTooShort);
            return;
        }

        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    displayName,
                    language: lang,
                },
                emailRedirectTo: `${window.location.origin}/pages/main`
            }
        });

        if (error) {
            setEroor('* ' + error.message);
            setLoading(false);
            return;
        }

        setDisplayName('');
        setEmail('');
        setPassword('');
        setEroor(null);

        if (data.session) {
            // Email confirmation is off — the user is already signed in
            router.push('/pages/main');
        } else {
            // Email confirmation required — no session yet, don't send
            // them to a protected page the middleware will just bounce
            alert(t.confirmEmail);
            router.push('/pages/signin');
        }
    }

    return (
        <div
            dir={isAr ? 'rtl' : 'ltr'}
            className="font-arabic flex flex-col justify-center items-center bg-linear-to-br from-emerald-50 to-teal-100 min-h-screen w-full">
            <form className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md" onSubmit={handleSubmit}>
                <h1 className="font-arabic text-4xl font-bold text-teal-700 text-center mb-6">{t.title}</h1>
                <div className="flex flex-col justify-center w-full">
                    <label htmlFor="displayName" className="font-arabic text-xl text-gray-600 leading-relaxed">{t.displayNameLabel}</label>
                    <input
                        id="displayName"
                        type="text"
                        placeholder={t.displayName}
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-3 py-2  rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none" />
                </div>
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
                <p className="font-arabic font-semibold text-red-500">{error}</p>
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

export default SignUp;