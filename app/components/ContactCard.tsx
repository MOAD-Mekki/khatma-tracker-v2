'use client';

const GITHUB_URL = "https://github.com/MOAD-Mekki";
const LINKEDIN_URL = "https://www.linkedin.com/in/mekki-moad";
const EMAIL = "moadahmedabdesselammekki@gmail.com";

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const contactTranslations = {
  ar: {
    email: "البريد الإلكتروني",
    close: "إغلاق",
  },
  en: {
    email: "Email ",
    close: "Close",
  },
};

interface ContactProps {
  onClose: () => void,
  lang: "ar" | "en"
}

export default function Contact({ onClose, lang } : ContactProps) {
  const t = contactTranslations[lang];
  const isAr = lang === "ar";

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      
    >
      <div
        dir={isAr ? "rtl" : "ltr"}
        className="bg-white rounded-3xl p-8 max-w-sm w-full flex flex-col items-center gap-4 shadow-2xl" 
        >
        
        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full">

          {/* GitHub */}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all hover:-translate-x-1 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center shrink-0">
              <GitHubIcon />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-arabic text-sm font-bold text-gray-800">GitHub</span>
              <span className="font-sans text-xs text-gray-400">{GITHUB_URL.replace("https://", "")}</span>
            </div>
          </a>

          {/* LinkedIn */}
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-all hover:-translate-x-1"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
              <LinkedInIcon />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-arabic text-sm font-bold text-blue-700">LinkedIn</span>
              <span className="font-sans text-xs text-blue-400">{LINKEDIN_URL.replace("https://", "")}</span>
            </div>
          </a>

          {/* Email */}
          <a
            href={`mailto:${EMAIL}?subject=`}
            className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-100 transition-all hover:-translate-x-1"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center shrink-0 text-lg">
              ✉️
            </div>
            <div className="flex flex-col items-start">
              <span className="font-arabic text-sm font-bold text-amber-700">{t.email}</span>
              <span className="font-sans text-xs text-amber-400">{EMAIL}</span>
            </div>
          </a>

        </div>

        <button
          onClick={onClose}
          className="font-arabic text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-xl transition-all cursor-pointer"
        >
          {t.close}
        </button>
      </div>
    </div>
  );
}