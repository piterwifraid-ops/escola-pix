interface QuizBeforeAfterProps {
  progress: number;
  onContinue: () => void;
}

const stats = [
  { label: "Nível de Estresse", before: 75, after: 15, beforeColor: "bg-red-400", afterColor: "bg-green-400" },
  { label: "Chance de Desistência", before: 88, after: 8, beforeColor: "bg-red-400", afterColor: "bg-green-400" },
  { label: "Clareza sobre o que fazer (após 7 dias)", before: 5, after: 98, beforeColor: "bg-red-400", afterColor: "bg-green-400" },
  { label: "Retorno Financeiro (após 7 dias)", before: 0, after: 92, beforeColor: "bg-red-400", afterColor: "bg-green-400" },
];

const QuizBeforeAfter = ({ progress, onContinue }: QuizBeforeAfterProps) => {
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
        <h2 className="text-xl font-black text-[hsl(var(--quiz-dark))] text-center mb-2 leading-tight">
          Pessoas como você conquistaram uma renda extra consistente de pelo menos{" "}
          <span className="text-[hsl(var(--quiz-orange))]">R$6.300</span> nos primeiros meses.
        </h2>
        <p className="text-sm text-[hsl(var(--quiz-gray))] text-center mb-5">
          Com a Mentoria Inconformados, você vai ser o próximo a ter um aumento na renda.
        </p>

        {/* Before/After label */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 bg-red-50 border border-red-200 rounded-lg py-2 text-center">
            <p className="text-xs font-black text-red-500 uppercase tracking-wide">❌ Antes</p>
            <p className="text-xs text-red-400">Sem método</p>
          </div>
          <div className="flex-1 bg-green-50 border border-green-200 rounded-lg py-2 text-center">
            <p className="text-xs font-black text-green-600 uppercase tracking-wide">✅ Depois</p>
            <p className="text-xs text-green-500">Com Inconformados</p>
          </div>
        </div>

        {/* Stats bars */}
        <div className="space-y-4 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[hsl(var(--muted))] rounded-xl p-4">
              <p className="text-xs font-bold text-[hsl(var(--quiz-dark))] mb-3">{stat.label}</p>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-red-500 font-semibold">❌ Sem método</span>
                    <span className="text-red-500 font-bold">{stat.before}%</span>
                  </div>
                  <div className="h-3 bg-red-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-400 rounded-full transition-all duration-700"
                      style={{ width: `${stat.before}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-green-600 font-semibold">✅ Com Inconformados</span>
                    <span className="text-green-600 font-bold">{stat.after}%</span>
                  </div>
                  <div className="h-3 bg-green-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-400 rounded-full transition-all duration-700"
                      style={{ width: `${stat.after}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Satisfaction */}
        <div className="bg-white border border-[hsl(var(--border))] rounded-xl p-4 mb-6">
          <p className="text-sm font-black text-[hsl(var(--quiz-dark))] mb-4 text-center">
            🎯 Satisfação e Feedback de quem realizou
          </p>
          <div className="flex gap-3">
            <div className="flex-1 bg-red-50 border border-red-100 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-red-500 mb-1">13%</p>
              <p className="text-xs text-red-400 leading-tight">
                Tentando sozinho: Você perde tempo, dinheiro e não sai do lugar.
              </p>
            </div>
            <div className="flex-1 bg-green-50 border border-green-100 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-green-600 mb-1">92%</p>
              <p className="text-xs text-green-600 leading-tight">
                Com a Mentoria Inconformados: Clareza total e resultados reais rapidamente.
              </p>
            </div>
          </div>
        </div>

        <button className="quiz-btn-primary" onClick={onContinue}>
          CONTINUAR
        </button>

        <p className="text-xs text-[hsl(var(--quiz-gray))] mt-8 text-center">
          © 2026 - Inconformados Mentoria
        </p>
      </div>
    </div>
  );
};

export default QuizBeforeAfter;
