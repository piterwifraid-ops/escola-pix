interface QuizOfferProps {
  progress: number;
  onContinue: () => void;
}

const offerItems = [
  {
    title: "✅ Estrutura de Loja Pronta",
    desc: "Receba a sua loja feita pelo nosso time, com os produtos validados já vinculados ao seu código. Sem precisar criar sites ou cadastrar produtos por conta própria.",
  },
  {
    title: "✅ Mentoria INCONFORMADOS (Manual de Ativação)",
    desc: "O passo a passo mastigado para você aprender do zero a gerenciar sua operação.",
  },
  {
    title: "✅ Acompanhamento do zero a primeira venda",
    desc: "O subsídio oficial que permite você começar hoje gratuitamente porque a WIX nos paga para garantir o seu sucesso.",
  },
  {
    title: "✅ Garantia Incondicional de 120 Dias",
    desc: "Risco zero. Se você não lucrar, eu não apenas devolvo seu dinheiro, eu te pago pelo seu tempo.",
    highlight: true,
  },
];

const QuizOffer = ({ progress, onContinue }: QuizOfferProps) => {
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

        {/* Urgency banner */}
        <div className="bg-red-600 text-white rounded-xl p-4 text-center mb-5">
          <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">
            ⚠️ VAGAS LIMITADAS
          </p>
          <p className="text-lg font-black">
            ATENÇÃO: Restam apenas{" "}
            <span className="text-yellow-300">9 vagas.</span>
          </p>
        </div>

        {/* What you receive */}
        <h2 className="text-lg font-black text-[hsl(var(--quiz-dark))] mb-4 text-center">
          Confira tudo que você vai receber se for aceito ainda hoje:
        </h2>

        <div className="space-y-3 mb-6">
          {offerItems.map((item) => (
            <div
              key={item.title}
              className={`rounded-xl p-4 border ${
                item.highlight
                  ? "bg-orange-50 border-orange-300"
                  : "bg-[hsl(var(--muted))] border-[hsl(var(--border))]"
              }`}
            >
              <p
                className={`text-sm font-black mb-1.5 ${
                  item.highlight
                    ? "text-[hsl(var(--quiz-orange))]"
                    : "text-[hsl(var(--quiz-dark))]"
                }`}
              >
                {item.title}
              </p>
              <p className="text-xs text-[hsl(var(--quiz-gray))] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Guarantee badge */}
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-black text-green-700">Garantia de 120 Dias</p>
            <p className="text-xs text-green-600">
              Se não lucrar, devolvemos o dinheiro + pagamos pelo seu tempo.
            </p>
          </div>
        </div>

        {/* Price comparison */}
        <div className="bg-[hsl(var(--quiz-dark))] text-white rounded-xl p-5 text-center mb-6">
          <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">
            Valor normal
          </p>
          <p className="text-2xl font-black line-through opacity-40 mb-1">R$997,00</p>
          <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">
            Para você hoje
          </p>
          <p className="text-4xl font-black text-[hsl(var(--quiz-orange))]">R$9,97</p>
 
        </div>

        <button className="quiz-btn-primary" onClick={onContinue}>
          GARANTIR MINHA VAGA!
        </button>

        <p className="text-xs text-[hsl(var(--quiz-gray))] mt-8 text-center">
          © 2026 - Inconformados Mentoria
        </p>
      </div>
    </div>
  );
};

export default QuizOffer;
