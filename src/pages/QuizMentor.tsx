import heroPerson from "@/assets/principal.jpg";
import socialFollowers from "@/assets/social-followers.png";

interface QuizMentorProps {
  progress: number;
  onContinue: () => void;
}

const mentorStats = [
  { icon: "🏆", title: "Player Real do mercado", desc: "Sócio de grandes marcas e lojas de 7 dígitos por ano" },
  { icon: "💰", title: "Mais de R$ 100 milhões", desc: "gerados por nossos alunos e parceiros." },
  { icon: "🎓", title: "+ de 15 mil alunos", desc: "transformados pelo método ao redor do mundo." },
  { icon: "🤝", title: "Parceria Oficial com a WIX", desc: "que garante a sua loja pronta com produtos subsidiada." },
];

const QuizMentor = ({ progress, onContinue }: QuizMentorProps) => {
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
          Mas quem está por trás desse acesso?
        </h2>

        {/* Mentor photo */}
        <div className="w-3/4 mx-auto rounded-2xl overflow-hidden mb-5 shadow-lg">
          <img
            src={heroPerson}
            alt="Pedro Pongeluppi - Mentor"
            className="w-full object-cover"
          />
        </div>

        {/* Bio */}
        <div className="mb-5">
          <p className="text-sm text-[hsl(var(--quiz-dark))] leading-relaxed mb-3">
            Prazer, meu nome é{" "}
            <strong className="text-[hsl(var(--quiz-orange))]">Arthur Batista</strong>, e eu
            serei seu mentor nessa jornada.
          </p>
          <p className="text-sm text-[hsl(var(--quiz-gray))] leading-relaxed mb-3">
            Atuo com marketing digital e e-commerce desde 2023, com foco em dropshipping e
            operações escaláveis no Brasil e no mercado internacional.
          </p>
          <p className="text-sm text-[hsl(var(--quiz-gray))] leading-relaxed mb-3">
            Sou fundador da <strong>Amparo</strong>, software que conectava médicos pediatras a pacientes. Em 2 anos, a empresa atingiu{" "}
            <strong>R$ 40 milhões em faturamento</strong>.
          </p>
          <p className="text-sm text-[hsl(var(--quiz-gray))] leading-relaxed">
            Agora, em 2026, retorno com o <strong>Projeto Inconformados</strong> para entregar método,
            clareza e estrutura para quem quer crescer no digital. Hoje, entrego para os meus alunso uma loja pronta para faturar +R$1000 nos primeiros 7d.
          </p>
        </div>

        {/* Why method works */}
        <div className="bg-[hsl(var(--muted))] rounded-xl p-4 mb-5">
          <p className="text-sm font-black text-[hsl(var(--quiz-dark))] mb-3">
            Por que meu método funciona?
          </p>
          {[
            "Alunos que começaram do zero já faturaram +R$50 mil no primeiro mês.",
            "Pessoas comuns já ultrapassaram os R$100 mil em vendas.",
            "Método validado em diversos nichos com estrutura replicável.",
            "Estrutura pronta elimina os principais bloqueios de quem está começando.",
          ].map((item) => (
            <p key={item} className="text-xs text-[hsl(var(--quiz-dark))] flex items-start gap-2 mb-2">
              <span className="text-green-500 mt-0.5 flex-shrink-0">✅</span> {item}
            </p>
          ))}
        </div>

        {/* Stats */}
        <p className="text-sm font-black text-[hsl(var(--quiz-dark))] mb-3">
          Números relevantes do seu mentor:
        </p>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {mentorStats.map((s) => (
            <div
              key={s.title}
              className="bg-white border border-[hsl(var(--border))] rounded-xl p-3"
            >
              <p className="text-xl mb-1">{s.icon}</p>
              <p className="text-xs font-black text-[hsl(var(--quiz-dark))] leading-tight mb-1">
                {s.title}
              </p>
              <p className="text-xs text-[hsl(var(--quiz-gray))] leading-tight">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Social followers */}
        <div className="mb-6">
          <p className="text-xs font-bold text-[hsl(var(--quiz-gray))] text-center mb-2">
            Milhares de seguidores nas Redes Sociais
          </p>
          <img
            src={socialFollowers}
            alt="Seguidores nas redes sociais"
            className="w-full rounded-xl border border-[hsl(var(--border))]"
          />
        </div>

        <p className="text-sm font-bold text-[hsl(var(--quiz-dark))] text-center mb-4">
          Preparado(a) pra ter essa grande mentora do seu lado?
        </p>

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

export default QuizMentor;
