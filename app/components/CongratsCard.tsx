'use client';

interface CardProps {
  khatmaCount: number,
  onNewKhatma: () => void,
  t: Record<string, string>
}

export default function CongratsCard({ khatmaCount, onNewKhatma, t } : CardProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div
        className="relative overflow-hidden rounded-3xl p-8 max-w-sm w-full text-center flex flex-col items-center gap-4"
        style={{
          background: "linear-gradient(145deg, #0d4f47, #0f766e, #115e59)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(94,234,212,0.2) 0%, transparent 70%)",
          }}
        />

        <span className="text-5xl">🏅</span>

        <span className="font-arabic text-sm text-teal-300 bg-white/10 border border-white/20 rounded-full px-4 py-1">
          {t.congratsKhatma}
        </span>

        <p className="font-arabic text-3xl text-white leading-relaxed">
          {t.congratsDua}
        </p>

        <p className="font-arabic text-base text-white/60 leading-loose">
          {t.congratsSub.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </p>

        <div className="w-10 h-0.5 bg-teal-400/50 rounded-full" />

        <div className="flex items-baseline gap-2">
          <span className="font-arabic text-5xl font-bold text-teal-300 leading-none">
            {khatmaCount}
          </span>
          <span className="font-arabic text-sm text-white/50">
            {t.congratsCount}
          </span>
        </div>

        <div className="flex gap-3 w-full mt-2">
          <button
            onClick={onNewKhatma}
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-arabic text-base font-medium py-3 rounded-xl transition-all hover:scale-105 cursor-pointer"
          >
            {t.congratsNew}
          </button>
        </div>
      </div>
    </div>
  );
}
