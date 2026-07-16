'use client';

interface CardProps {
  id: number,
  title: string,
  completed: boolean,
  onClick: () => void
}

export default function Card({ id, title, completed, onClick } : CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        cursor-pointer rounded-2xl p-4 transition-all duration-200
        flex flex-col items-center text-center gap-1
        hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400
        shadow-sm hover:shadow-md
        ${
          completed
            ? "bg-teal-700 text-white border-2 border-teal-600"
            : "bg-white text-gray-800 border border-teal-200 hover:border-teal-400"
        }
      `}
    >

      {/*  The right sign rendering */}
      {completed && (
        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mb-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}

      {/* // Hizb or Juz number */}
      <span className="text-xs font-sans text-gray-400 font-medium leading-none">
        {id}
      </span>

      {/* // Hizb or Juz name  */}
      <p className="font-arabic text-base font-bold leading-snug">{title}</p>
    </div>
  );
}
