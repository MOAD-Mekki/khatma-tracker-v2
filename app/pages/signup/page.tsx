'use client';

import { useLang } from "@/app/context/LanguageContext";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
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
    }
}

function SignUp() {
    const supabase = createClient();
    const {lang} = useLang();
    const [displayName, setDisplayName] = useState<string>('');
    const [email,setEmail] = useState<string>('');
    const [password,setPassword] = useState<string>('');
    const [error,setEroor] = useState<string | null>(null);
    const t = signUpTranslation[lang];
    const isAr = lang === "ar";
    const router = useRouter();

        async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
            event.preventDefault();

            if (email.trim() === '' || password.trim() === '') {
                isAr ? setEroor('* الرجاء ملىء جميع المجالات') : setEroor('* Please fill out all the fields');
            } else {
                const {data: {user},error} = await supabase.auth.signUp({
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
                   isAr ? setEroor('* خطا في قاعدة البيانات') : setEroor('* DB Error');
                } else {
                    console.log('signed up successfully');
                    
                    await supabase.from('khatma_progress').insert({
                        user_id: user?.id,
                        khatma_count: 0,
                        ajzaa: [],
                        ahzab: []
                    }) 
                    
                    setDisplayName('');
                    setEmail('');
                    setPassword('');
                    setEroor(null);
                    alert("Account created! Please check your email to confirm before logging in.");
                    router.push('/pages/main');
                }
            }
        }
        
    return ( 
        <div 
            dir={isAr ? 'rtl' : 'ltr'}
            className="font-arabic flex flex-col justify-center items-center bg-linear-to-br from-emerald-50 to-teal-100 min-h-screen w-full">
            <form action="" className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md" onSubmit={handleSubmit}>
                <h1 className="text-4xl font-bold text-teal-700 text-center mb-6">{t.title}</h1>
                <div className="flex flex-col justify-center w-full">
                    <label htmlFor="" className="font-arabic text-xl text-gray-600 leading-relaxed">{t.displayNameLabel}</label>
                    <input 
                        type="name" 
                        placeholder={t.displayName}
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-3 py-2  rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"/>
                </div>
                <div className="flex flex-col justify-center w-full">
                    <label htmlFor="" className="font-arabic text-xl text-gray-600 leading-relaxed">{t.emailLabel}</label>
                    <input 
                        type="email" 
                        placeholder={t.emailPlaceHolder}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2  rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"/>
                </div>
                <div className="mb-6">
                    <label htmlFor="" className="font-arabic text-xl text-gray-600 leading-relaxed">{t.passwordLabel}</label>
                    <input 
                        type="password"
                        placeholder={t.passwordPlaceHolder}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2  rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"/>
                </div>
                <p className="font-arabic font-semibold text-red-500">{error}</p>
                <button className="w-full items-center mt-2 bg-teal-500 hover:bg-teal-600 text-white font-arabic font-medium py-2.5 px-8 rounded-full text-lg transition-all hover:scale-105 cursor-pointer">{t.submitButton}</button>
            </form>
        </div> 
    );
}

export default SignUp;