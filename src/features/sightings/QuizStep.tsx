import { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { useT } from '@/i18n';
import { cn } from '@/lib/cn';
import type { QuizQuestion } from './quizGenerator';

interface QuizStepProps {
  question: QuizQuestion;
  animalName: string;
  onContinue: () => void;
}

export function QuizStep({ question, animalName, onContinue }: QuizStepProps) {
  const t = useT();
  const [selected, setSelected] = useState<string | null>(null);

  const isCorrect = selected === question.correctValue;
  const feedbackKey = `quiz.feedback.${question.type}.${question.correctValue}`;

  if (!selected) {
    return (
      <div className="flex flex-col gap-8 py-6">
        <div className="text-center">
          <p className="text-xs font-extrabold uppercase tracking-wider text-accent">
            {t('quiz.title')}
          </p>
          <h2 className="mt-2 text-2xl font-extrabold leading-tight">
            {t(`quiz.q.${question.type}`, { name: animalName })}
          </h2>
        </div>
        <div className="space-y-3">
          {question.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSelected(opt.value)}
              className="w-full rounded-button border-2 border-foreground/15 bg-cream py-4 text-base font-extrabold text-foreground transition-colors hover:border-primary"
            >
              {t(opt.labelKey)}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onContinue}
          className="text-center text-sm font-semibold text-foreground/60 underline-offset-4 hover:underline"
        >
          {t('quiz.skip')}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      <span
        className={cn(
          'flex h-24 w-24 items-center justify-center rounded-full shadow-card',
          isCorrect ? 'bg-success' : 'bg-highlight',
        )}
      >
        {isCorrect ? (
          <Check className="h-14 w-14 text-foreground" strokeWidth={2.5} />
        ) : (
          <Sparkles className="h-12 w-12 text-foreground" strokeWidth={2.5} />
        )}
      </span>
      <h2 className="text-3xl font-extrabold">
        {isCorrect ? t('quiz.correct') : t('quiz.almost')}
      </h2>
      <p className="text-lg leading-relaxed text-foreground/80">
        {t(feedbackKey, { name: animalName })}
      </p>
      <button
        type="button"
        onClick={onContinue}
        className="mt-2 inline-flex items-center justify-center rounded-button bg-accent px-8 py-3 text-lg font-extrabold text-foreground shadow-card"
      >
        {t('quiz.continue')}
      </button>
    </div>
  );
}
