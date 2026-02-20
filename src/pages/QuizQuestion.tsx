import { useState } from "react";

interface QuizQuestionProps {
  progress: number;
  stepLabel: string;
  question: string;
  options: string[];
  onSelect: (value: string) => void;
  currentStep: number;
  totalQuestions: number;
}

const QuizQuestion = ({
  progress,
  stepLabel,
  question,
  options,
  onSelect,
}: QuizQuestionProps) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (opt: string) => {
    setSelected(opt);
    setTimeout(() => {
      onSelect(opt);
      setSelected(null);
    }, 400);
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

        {/* Step label */}
        <p className="text-xs font-semibold text-[hsl(var(--quiz-gray))] uppercase tracking-wider mb-3 text-center">
          Pergunta {stepLabel}
        </p>

        {/* Question */}
        <h2 className="text-xl font-black text-[hsl(var(--quiz-dark))] leading-tight mb-6 text-center">
          {question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {options.map((opt) => (
            <button
              key={opt}
              className={`quiz-option ${selected === opt ? "selected" : ""}`}
              onClick={() => handleSelect(opt)}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
                    selected === opt
                      ? "border-[hsl(var(--quiz-orange))] bg-[hsl(var(--quiz-orange))]"
                      : "border-[hsl(var(--quiz-option-border))]"
                  }`}
                >
                  {selected === opt && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
                {opt}
              </span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <p className="text-xs text-[hsl(var(--quiz-gray))] mt-10 text-center">
          © 2026 - Inconformados Mentoria
        </p>
      </div>
    </div>
  );
};

export default QuizQuestion;
