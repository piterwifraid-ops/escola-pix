import heroPerson from "@/assets/principal.jpg";
import { useState } from "react";
import QuizQuestion from "./QuizQuestion";
import QuizSocialProof from "./QuizSocialProof";
import QuizBeforeAfter from "./QuizBeforeAfter";
import QuizMentor from "./QuizMentor";
import QuizReady from "./QuizReady";
import QuizOffer from "./QuizOffer";
import QuizForm from "./QuizForm";
import QuizResult from "./QuizResult";

export type QuizAnswers = {
  [key: string]: string;
};

// Steps:
// 0 = Landing
// 1–6 = Questions
// 7 = Social Proof
// 8 = Before/After
// 9 = Mentor
// 10 = Ready
// 11 = Offer
// 12 = Form
// 13 = Result
const TOTAL_STEPS = 13;

const questions = [
  {
    key: "experiencia",
    title: "Você já tem alguma experiência com vendas online?",
    options: [
      "Nunca vendi nada online",
      "Já tentei, mas não tive resultado",
      "Tenho alguma experiência",
      "Já vendo online regularmente",
    ],
  },
  {
    key: "renda",
    title: "Qual é sua renda mensal atual?",
    options: [
      "Até R$1.500",
      "Entre R$1.500 e R$3.000",
      "Entre R$3.000 e R$6.000",
      "Acima de R$6.000",
    ],
  },
  {
    key: "tempo",
    title: "Quanto tempo por dia você pode dedicar ao negócio?",
    options: [
      "Menos de 1 hora",
      "Entre 1 e 2 horas",
      "Entre 2 e 4 horas",
      "Mais de 4 horas",
    ],
  },
  {
    key: "objetivo",
    title: "Qual é o seu principal objetivo com a mentoria?",
    options: [
      "Ter uma renda extra",
      "Substituir meu salário",
      "Alcançar liberdade financeira",
      "Criar um negócio sólido",
    ],
  },
  {
    key: "investimento",
    title: "Você tem capital para investir no negócio?",
    options: [
      "Menos de R$500",
      "Entre R$500 e R$1.000",
      "Entre R$1.000 e R$3.000",
      "Mais de R$3.000",
    ],
  },
  {
    key: "comprometimento",
    title: "Você está disposto a seguir um método passo a passo?",
    options: [
      "Sim, estou totalmente comprometido",
      "Sim, mas precisarei de suporte",
      "Tenho dúvidas, mas quero tentar",
      "Prefiro ver mais antes de decidir",
    ],
  },
];

const Index = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});

  const progress = Math.round((step / TOTAL_STEPS) * 100);
  const next = () => setStep((s) => s + 1);

  const handleAnswer = (questionKey: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionKey]: value }));
    next();
  };

  // Step 0: Landing
  if (step === 0) {
    return (
      <div className="quiz-container">
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="px-4 pt-8 pb-10 flex flex-col items-center">
          <div className="mb-6 text-center">
            <span className="text-3xl font-black tracking-[0.15em] text-[hsl(var(--quiz-dark))] uppercase">
              INCONFORMADOS
            </span>
          </div>

          <h1 className="text-2xl font-black text-center text-[hsl(var(--quiz-dark))] leading-tight mb-5">
            <span>Entre para</span> a Mentoria Inconformados e faça{" "}
            <span>R$1000+ em 7 dias</span> com um produto viral
          </h1>

          <div className="w-56 h-56 rounded-2xl overflow-hidden mb-6 shadow-lg">
            <img
              src={heroPerson}
              alt="Mentor em Dubai"
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="w-full space-y-2 mb-6 text-center">
            {[
                            "MESMO SE ESTIVER COMEÇANDO DO 0",
              "RECEBA UMA LOJA VALIDADA PRONTA",
              "SEM PRECISAR TER ESTOQUE",
              "SEM PRECISAR APARECER",
            ].map((benefit) => (
              <p key={benefit} className="text-sm font-bold text-[hsl(var(--quiz-dark))]">
                <span className="quiz-checkmark">✅</span> {benefit}
              </p>
            ))}
          </div>

          <div className="w-full bg-[hsl(var(--quiz-light-bg))] rounded-xl p-5 mb-6 border border-[hsl(var(--border))]">
            <p className="text-sm text-[hsl(var(--quiz-gray))] leading-relaxed mb-3">
              Concorra a uma vaga gratuita na mentoria{" "}
              <strong className="text-[hsl(var(--quiz-orange))]">Inconformados</strong> para aprender
              a montar uma loja gringa com um método validado.
            </p>
            <p className="text-sm font-bold text-[hsl(var(--quiz-dark))] mb-2">
              Preencha com atenção para seguir adiante.
            </p>
            <p className="text-xs text-[hsl(var(--quiz-gray))]">
              Mesmo que você não tenha nenhuma experiência e menos de R$1.000,00 para começar.
            </p>
          </div>

          <button className="quiz-btn-primary" onClick={next}>
            QUERO UMA VAGA!
          </button>

          <p className="text-xs text-[hsl(var(--quiz-gray))] mt-8">
            © 2026 - Inconformados Mentoria
          </p>
        </div>
      </div>
    );
  }

  // Steps 1–6: Questions
  if (step >= 1 && step <= 6) {
    const q = questions[step - 1];
    return (
      <QuizQuestion
        progress={progress}
        stepLabel={`${step} de 6`}
        question={q.title}
        options={q.options}
        onSelect={(val) => handleAnswer(q.key, val)}
        currentStep={step}
        totalQuestions={6}
      />
    );
  }

  // Step 7: Social Proof
  if (step === 7) {
    return <QuizSocialProof progress={progress} onContinue={next} />;
  }

  // Step 8: Before/After
  if (step === 8) {
    return <QuizBeforeAfter progress={progress} onContinue={next} />;
  }

  // Step 9: Mentor
  if (step === 9) {
    return <QuizMentor progress={progress} onContinue={next} />;
  }

  // Step 10: Ready
  if (step === 10) {
    return <QuizReady progress={progress} onContinue={next} />;
  }

  // Step 11: Offer
  if (step === 11) {
    return <QuizOffer progress={progress} onContinue={next} />;
  }

  // Step 12: Form
  if (step === 12) {
    return <QuizForm progress={progress} onSubmit={next} />;
  }

  // Step 13: Result
  return <QuizResult />;
};

export default Index;
