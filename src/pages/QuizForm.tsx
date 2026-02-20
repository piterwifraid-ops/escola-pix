import { useState } from "react";

interface QuizFormProps {
  progress: number;
  onSubmit: () => void;
}

const QuizForm = ({ progress, onSubmit }: QuizFormProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const isValid = name.trim().length > 2 && phone.replace(/\D/g, "").length >= 10 && email.includes("@");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSubmit();
    }, 1500);
  };

  return (
    <div className="quiz-container">
      {/* Progress bar */}
      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="px-6 pt-8 pb-10">
        {/* Logo */}
        <div className="mb-6 text-center">
          <span className="text-2xl font-black tracking-[0.15em] text-[hsl(var(--quiz-dark))] uppercase">
            INCONFORMADOS
          </span>
        </div>

        {/* Headline */}
        <div className="mb-6 text-center">
          <span className="inline-block bg-[hsl(var(--quiz-orange))] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            🎉 Você está quase lá!
          </span>
          <h2 className="text-xl font-black text-[hsl(var(--quiz-dark))] leading-tight">
            Preencha seus dados para garantir sua vaga gratuita
          </h2>
        </div>

        {/* Benefits reminder */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-bold text-[hsl(var(--quiz-dark))] mb-2">
            O que você vai receber:
          </p>
          {[
            "Acesso à Mentoria Inconformados GRÁTIS",
            "Loja validada pronta para vender",
            "Método passo a passo validado",
          ].map((item) => (
            <p key={item} className="text-xs text-[hsl(var(--quiz-dark))] flex items-center gap-2">
              <span className="text-[hsl(var(--quiz-success))]">✅</span> {item}
            </p>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[hsl(var(--quiz-gray))] uppercase tracking-wider block mb-1.5">
              Seu nome completo
            </label>
            <input
              type="text"
              className="quiz-input"
              placeholder="Digite seu nome..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[hsl(var(--quiz-gray))] uppercase tracking-wider block mb-1.5">
              Seu WhatsApp
            </label>
            <input
              type="tel"
              className="quiz-input"
              placeholder="(11) 99999-9999"
              value={phone}
              onChange={handlePhone}
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[hsl(var(--quiz-gray))] uppercase tracking-wider block mb-1.5">
              Seu melhor e-mail
            </label>
            <input
              type="email"
              className="quiz-input"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="quiz-btn-primary mt-2"
            disabled={!isValid || loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processando...
              </span>
            ) : (
              "GARANTIR MINHA VAGA GRÁTIS!"
            )}
          </button>

          <p className="text-xs text-center text-[hsl(var(--quiz-gray))]">
            🔒 Seus dados estão seguros. Não enviamos spam.
          </p>
        </form>

        {/* Footer */}
        <p className="text-xs text-[hsl(var(--quiz-gray))] mt-8 text-center">
          © 2026 - Inconformados Mentoria
        </p>
      </div>
    </div>
  );
};

export default QuizForm;
