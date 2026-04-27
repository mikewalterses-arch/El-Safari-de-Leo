import type { CuratedTags } from '@/types/models';

/**
 * Genera una pregunta de quiz post-identificación con 3 opciones.
 * Solo funciona con animales del catálogo curado (los que tienen CuratedTags).
 *
 * Tipos de pregunta soportadas:
 * - group: "¿Qué tipo de animal es {name}?" — 3 opciones de los 6 grupos.
 * - diet:  "¿Qué come {name}?" — las 3 opciones (carnívoro/herbívoro/omnívoro).
 *
 * Aleatoria entre los tipos para variedad. Sin penalización: la respuesta
 * incorrecta se trata con feedback amigable.
 */

export type QuizQuestionType = 'group' | 'diet';

export interface QuizOption {
  value: string;
  labelKey: string;
}

export interface QuizQuestion {
  type: QuizQuestionType;
  options: QuizOption[];
  correctValue: string;
}

const GROUPS = ['mamifero', 'ave', 'pez', 'reptil', 'anfibio', 'invertebrado'];
const DIETS = ['carnivoro', 'herbivoro', 'omnivoro'];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

export function generateQuestion(tags: CuratedTags): QuizQuestion {
  const types: QuizQuestionType[] = ['group', 'diet'];
  const type = types[Math.floor(Math.random() * types.length)]!;

  if (type === 'diet') {
    return {
      type: 'diet',
      options: shuffle(DIETS).map((d) => ({
        value: d,
        labelKey: `quiz.opt.diet.${d}`,
      })),
      correctValue: tags.diet,
    };
  }

  // group: 1 correcta + 2 distractoras del resto
  const correct = tags.group;
  const distractors = shuffle(GROUPS.filter((g) => g !== correct)).slice(0, 2);
  const options = shuffle([correct, ...distractors]).map((g) => ({
    value: g,
    labelKey: `quiz.opt.group.${g}`,
  }));
  return { type: 'group', options, correctValue: correct };
}
