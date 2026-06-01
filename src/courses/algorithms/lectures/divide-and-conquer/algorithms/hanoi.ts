import type { AlgorithmInput, AlgorithmSpec, Frame, ValidateResult } from '@/core/engine/types'
import { hanoiBlock } from '../pseudocode'
import type { HanoiScene } from '../scene'
import HanoiView from '../views/HanoiView'

const PEG = ['A', 'B', 'C']

/**
 * Towers of Hanoi. Not an array algorithm — each frame carries the 3-peg state in
 * `scene` (read by HanoiView). Frames are built directly (no FrameBuilder) but
 * reuse the player's narration / code-highlight / call-depth machinery.
 */
export function runHanoi(input: AlgorithmInput): Frame[] {
  const n = Math.max(1, Math.min(6, Math.round(input.array[0] ?? 3)))
  const pegs: number[][] = [[], [], []]
  for (let d = n; d >= 1; d--) pegs[0].push(d) // largest at the bottom
  const frames: Frame[] = []
  let moves = 0

  const emit = (
    codeLine: number | null,
    narration: string,
    callDepth: number,
    opts: { moving?: HanoiScene['moving']; done?: boolean } = {},
  ) => {
    const scene: HanoiScene = { pegs: pegs.map((p) => [...p]), moving: opts.moving, moves }
    const frame: Frame = {
      id: frames.length,
      array: [],
      elementIds: [],
      heapSize: 0,
      n: 0,
      highlights: [],
      codeLine,
      codeBlock: 'hanoi',
      narration,
      action: opts.done ? { kind: 'done' } : undefined,
      callDepth,
      scene,
    }
    Object.freeze(scene.pegs)
    Object.freeze(scene)
    Object.freeze(frame)
    frames.push(frame)
  }

  emit(null, `מצב התחלתי: ${n} דיסקיות על עמוד A. המטרה — להעביר את כולן לעמוד C.`, 0)

  const han = (k: number, from: number, to: number, via: number, depth: number): void => {
    emit(1, `Hanoi(${k}): מ-${PEG[from]} אל ${PEG[to]} (עזר: ${PEG[via]}).`, depth)
    if (k === 0) {
      emit(2, `n = 0 — אין מה להעביר, חוזרים.`, depth)
      return
    }
    emit(3, `קודם מעבירים ${k - 1} דיסקיות מ-${PEG[from]} אל ${PEG[via]}.`, depth)
    han(k - 1, from, via, to, depth + 1)

    const disk = pegs[from].pop()!
    pegs[to].push(disk)
    moves++
    emit(4, `מזיזים דיסקית ${disk}: ${PEG[from]} → ${PEG[to]} (מהלך ${moves}).`, depth, {
      moving: { disk, from, to },
    })

    emit(5, `ולבסוף ${k - 1} דיסקיות מ-${PEG[via]} אל ${PEG[to]}.`, depth)
    han(k - 1, via, to, from, depth + 1)
  }

  han(n, 0, 2, 1, 0)

  emit(
    null,
    `סיום! כל ${n} הדיסקיות עברו ל-C ב-${moves} מהלכים (= 2^${n} − 1 = ${2 ** n - 1}). 🎉`,
    0,
    { done: true },
  )
  return frames
}

function validateDisks(raw: string): ValidateResult {
  const t = raw.trim()
  if (!/^\d+$/.test(t)) return { ok: false, error: 'הזינו מספר דיסקיות שלם (בין 1 ל-6).' }
  const v = Number(t)
  if (v < 1 || v > 6) return { ok: false, error: 'מספר הדיסקיות חייב להיות בין 1 ל-6.' }
  return { ok: true, value: { array: [v] } }
}

export const hanoiSpec: AlgorithmSpec = {
  id: 'hanoi',
  titleHe: 'מגדלי האנוי — Hanoi',
  titleEn: 'Towers of Hanoi',
  kind: 'main',
  blurbHe:
    'חידה רקורסיבית קלאסית: להעביר מגדל דיסקיות מעמוד לעמוד, דיסקית אחת בכל פעם, בלי להניח דיסקית גדולה על קטנה. הפתרון: להעביר n−1 הצידה, להזיז את הגדולה, ולהעביר n−1 חזרה.',
  complexity: 'O(2^n)',
  proof: {
    result: '\\Theta(2^n)',
    claimHe:
      'כל קריאה פותרת שתי תת-בעיות בגודל n−1 ועוד מהלך אחד — ומכאן מספר המהלכים הוא בדיוק 2ⁿ−1.',
    steps: [
      { he: 'נוסחת הנסיגה למספר המהלכים:', tex: 'T(n) = 2T(n-1) + 1,\\quad T(0) = 0' },
      { he: 'פתרון הנוסחה (פיתוח/אינדוקציה):', tex: 'T(n) = 2^n - 1 = \\Theta(2^n)' },
    ],
    intuitionHe:
      'הגדילה מעריכית: כל דיסקית נוספת מכפילה את מספר המהלכים. 64 דיסקיות (אגדת מגדל בְּרַהְמָה) ידרשו ‎2⁶⁴−1‎ מהלכים — יותר מגיל היקום.',
  },
  pseudocode: [hanoiBlock],
  views: ['custom'],
  customViz: HanoiView,
  run: runHanoi,
  validateInput: validateDisks,
  defaultInput: { array: [3] },
  presets: [
    { labelHe: '3 דיסקיות', input: { array: [3] }, noteHe: '7 מהלכים.' },
    { labelHe: '4 דיסקיות', input: { array: [4] }, noteHe: '15 מהלכים.' },
    { labelHe: '5 דיסקיות', input: { array: [5] }, noteHe: '31 מהלכים — שימו לב לגדילה.' },
    {
      labelHe: '6 דיסקיות — המקרה הגרוע ביותר',
      input: { array: [6] },
      worst: true,
      noteHe: '63 מהלכים — הכי הרבה עבודה (גדילה מעריכית 2ⁿ−1).',
    },
  ],
}
