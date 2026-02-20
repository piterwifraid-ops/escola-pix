interface QuizReadyProps {
  progress: number;
  onContinue: () => void;
}

const resultImages = [
  "https://media.inlead.cloud/uploads/44145/2026-02-09/lg-rVP5O-02-748x1024.png",
  "https://media.inlead.cloud/uploads/44145/2026-02-09/lg-9IoRA-01-805x1024.png",
];

const QuizReady = ({ progress, onContinue }: QuizReadyProps) => {
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

        {/* Fire badge */}
        <div className="text-center mb-4">
          <span className="inline-block bg-orange-100 text-[hsl(var(--quiz-orange))] text-sm font-bold px-4 py-2 rounded-full">
            🔥 Você está quase lá!
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-xl font-black text-[hsl(var(--quiz-dark))] text-center mb-3 leading-tight">
          Você está pronto(a) para ser o próximo a aplicar e ter esse tipo de resultado?
        </h2>

        <p className="text-sm text-[hsl(var(--quiz-gray))] text-center mb-6 leading-relaxed">
          Você não precisa ter ideias mirabolantes ou experiência prévia, basta seguir o{" "}
          <strong className="text-[hsl(var(--quiz-dark))]">passo a passo já validado</strong>.
        </p>

        {/* Result images grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {resultImages.map((src, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-[hsl(var(--border))] shadow-sm">
              <img src={src} alt={`Resultado ${i + 1}`} className="w-full object-cover" />
            </div>
          ))}
        </div>

        {/* Urgency */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-black text-red-600 text-center mb-1">
            ⚠️ ATENÇÃO
          </p>
          <p className="text-xs text-red-500 text-center">
            As vagas são limitadas. Ao fechar essa página você pode perder sua
            oportunidade.
          </p>
        </div>

        {/* Checklist */}
        <div className="space-y-2 mb-6">
          {[
            "Sem precisar aparecer nas redes sociais",
            "Sem precisar ter produto próprio",
            "Sem precisar ter estoque",
            "Começando do zero com suporte completo",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-lg px-4 py-2.5"
            >
              <span className="text-green-500 font-bold text-base flex-shrink-0">✅</span>
              <p className="text-sm font-semibold text-[hsl(var(--quiz-dark))]">{item}</p>
            </div>
          ))}
        </div>

        <button className="quiz-btn-primary" onClick={onContinue}>
          SIM, ESTOU PRONTO(A)!
        </button>

        <p className="text-xs text-[hsl(var(--quiz-gray))] mt-8 text-center">
          © 2026 - Inconformados Mentoria
        </p>
      </div>
    </div>
  );
};

export default QuizReady;
