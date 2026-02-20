import { useState, useRef } from "react";
import t1 from "@/assets/testimonial-1.png";
import t2 from "@/assets/testimonial-2.png";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface QuizSocialProofProps {
  progress: number;
  onContinue: () => void;
}

const testimonials = [t1, t2];

const chartData = [
  { dia: "Hoje", valor: 0 },
  { dia: "3 Dias", valor: 547 },
  { dia: "7 Dias", valor: 2847 },
];

const QuizSocialProof = ({ progress, onContinue }: QuizSocialProofProps) => {
  const [current, setCurrent] = useState(0);
  const startX = useRef<number>(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = startX.current - e.changedTouches[0].clientX;
    if (diff > 40) next();
    else if (diff < -40) prev();
  };

  return (
    <div className="quiz-container">
      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="px-6 pt-8 pb-10">
        {/* Logo */}
        <div className="mb-5 text-center">
          <span className="text-2xl font-black tracking-[0.15em] text-[hsl(var(--quiz-dark))] uppercase">
            INCONFORMADOS
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-xl font-black text-[hsl(var(--quiz-dark))] text-center mb-5 leading-tight">
          Veja o que pessoas na sua faixa de renda conseguiram:
        </h2>

        {/* Testimonial Carousel */}
        <div
          className="relative overflow-hidden rounded-2xl mb-4 select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {testimonials.map((src, i) => (
              <div key={i} className="w-full flex-shrink-0">
                <img
                  src={src}
                  alt={`Depoimento ${i + 1}`}
                  className="w-full rounded-2xl border border-[hsl(var(--border))]"
                />
              </div>
            ))}
          </div>

          {/* Arrows */}
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full shadow flex items-center justify-center text-[hsl(var(--quiz-dark))]"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full shadow flex items-center justify-center text-[hsl(var(--quiz-dark))]"
          >
            ›
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-5 h-2 bg-[hsl(var(--quiz-orange))]"
                  : "w-2 h-2 bg-[hsl(var(--border))]"
              }`}
            />
          ))}
        </div>

        {/* Stats text */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-5">
          <p className="text-sm font-bold text-[hsl(var(--quiz-dark))] mb-3">
            Mais de <span className="text-[hsl(var(--quiz-orange))]">97 pessoas</span> na sua
            faixa de renda já começaram essa semana.
          </p>
          <div className="space-y-1.5">
            {[
              "Não precisa largar o emprego pra começar",
              "Investe apenas 2 horas livres por dia",
              "Sem estoque, sem aparecer, sem risco",
            ].map((item) => (
              <p key={item} className="text-xs text-[hsl(var(--quiz-dark))] flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✅</span> {item}
              </p>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white border border-[hsl(var(--border))] rounded-xl p-4 mb-6">
          <p className="text-xs font-bold text-[hsl(var(--quiz-gray))] uppercase tracking-wider mb-3">
            👇 Trajetória prevista de faturamento (baseada em alunos reais):
          </p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(26,95%,55%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(26,95%,55%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `R$${v}`} />
                <Tooltip formatter={(v: number) => [`R$${v.toLocaleString("pt-BR")}`, "Faturamento"]} />
                <ReferenceLine x="3 Dias" stroke="hsl(26,95%,55%)" strokeDasharray="3 3" label={{ value: "R$547", position: "top", fontSize: 10 }} />
                <ReferenceLine x="7 Dias" stroke="hsl(26,95%,55%)" strokeDasharray="3 3" label={{ value: "R$2.847", position: "top", fontSize: 10 }} />
                <Area
                  type="monotone"
                  dataKey="valor"
                  stroke="hsl(26,95%,55%)"
                  strokeWidth={2.5}
                  fill="url(#colorValor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <button className="quiz-btn-primary" onClick={onContinue}>
          QUERO TER ESSE RESULTADO
        </button>

        <p className="text-xs text-[hsl(var(--quiz-gray))] mt-8 text-center">
          © 2026 - Inconformados Mentoria
        </p>
      </div>
    </div>
  );
};

export default QuizSocialProof;
