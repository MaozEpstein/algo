import { FrameBuilder, hl } from '@/core/engine/FrameBuilder'
import { rangeInclusive } from '@/core/engine/indexing'
import { parseIntArray } from '@/core/engine/parseInput'
import type { AlgorithmInput, AlgorithmSpec, Frame, Highlight, Marker } from '@/core/engine/types'
import { mergeBlock } from '../pseudocode'
import type { MergeScene } from '../scene'
import MergeSortView from '../views/MergeSortView'

interface MergeCtx {
  /** Ranges already merged (for the recursion-tree "done" shading). */
  done?: Set<string>
}

/**
 * Animate merging the two already-sorted halves A[p..mid] and A[mid+1..r] into a
 * single sorted run, via the auxiliary output lane. Each chosen element is moved
 * (value + identity) into the output, then the whole run is copied back. Mutates
 * the builder in place.
 */
export function mergeInto(
  b: FrameBuilder,
  p: number,
  mid: number,
  r: number,
  depth: number,
  ctx: MergeCtx = {},
): void {
  const scene = (): MergeScene => ({
    active: { lo: p, hi: r },
    phase: 'merge',
    done: [...(ctx.done ?? [])],
  })
  b.setBlock('merge')
  b.setScene(scene())
  b.openAux('פלט')

  let i = p
  let j = mid + 1

  const markers = (): Marker[] => {
    const m: Marker[] = []
    if (i <= mid) m.push({ label: 'i', index: i, tone: 'i' })
    if (j <= r) m.push({ label: 'j', index: j, tone: 'j' })
    return m
  }
  const baseHl = (): Highlight[] => {
    const h: Highlight[] = []
    const lh = rangeInclusive(p, mid).filter((x) => x >= i)
    const rh = rangeInclusive(mid + 1, r).filter((x) => x >= j)
    if (lh.length) h.push(hl('less', ...lh))
    if (rh.length) h.push(hl('greater', ...rh))
    return h
  }

  b.emit({
    codeBlock: 'merge',
    codeLine: 2,
    callDepth: depth,
    narration: `מיזוג שני החצאים הממוינים: [${p}..${mid}] ו-[${mid + 1}..${r}].`,
    highlights: baseHl(),
    markers: markers(),
  })

  for (let k = p; k <= r; k++) {
    const bothLive = i <= mid && j <= r
    const takeLeft = j > r || (i <= mid && b.value(i) <= b.value(j))
    const cmpHl = baseHl()
    if (bothLive) cmpHl.push(hl('comparing', i, j))
    b.emit({
      codeBlock: 'merge',
      codeLine: 3,
      callDepth: depth,
      action: bothLive ? { kind: 'compare', a: b.value(i), b: b.value(j) } : undefined,
      narration: bothLive
        ? `משווים ${b.value(i)} מול ${b.value(j)} — לוקחים את ${takeLeft ? b.value(i) : b.value(j)}.`
        : `חצי אחד נגמר — מעבירים את השארית: ${takeLeft ? b.value(i) : b.value(j)}.`,
      highlights: cmpHl,
      markers: markers(),
    })

    const src = takeLeft ? i : j
    if (takeLeft) i++
    else j++
    b.moveToAux(src)
    b.emit({
      codeBlock: 'merge',
      codeLine: takeLeft ? 4 : 6,
      callDepth: depth,
      narration: `הערך עבר אל מסלול הפלט (מקום ${k - p + 1}).`,
      highlights: baseHl(),
      markers: markers(),
      auxHighlights: [hl('comparing', b.auxLength)],
    })
  }

  b.emit({
    codeBlock: 'merge',
    codeLine: 7,
    callDepth: depth,
    narration: `הפלט ממוין — מעתיקים אותו בחזרה אל [${p}..${r}].`,
  })
  b.copyAuxBack(p)
  b.setBlock('merge')
  b.emit({
    codeBlock: 'merge',
    codeLine: 7,
    callDepth: depth,
    narration: `המקטע [${p}..${r}] ממוין. ✓`,
    highlights: [hl('sorted', ...rangeInclusive(p, r))],
  })
}

/** Standalone "Merge" demo: silently sorts each half, then animates the merge. */
export function runMerge(input: AlgorithmInput): Frame[] {
  const arr = input.array.slice()
  const n = arr.length
  const mid0 = Math.floor(n / 2) // left = first mid0 items
  const left = arr.slice(0, mid0).sort((a, c) => a - c)
  const right = arr.slice(mid0).sort((a, c) => a - c)
  const prepared = [...left, ...right]
  const b = new FrameBuilder(prepared)
  const mid = mid0 // 1-indexed: left half is [1..mid]

  b.setBlock('merge')
  b.setScene({ active: { lo: 1, hi: n }, phase: 'merge', done: [] } as MergeScene)
  b.emit({
    codeBlock: 'merge',
    codeLine: 1,
    narration: 'נתונים שני חצאים ממוינים. נמזג אותם למערך ממוין אחד.',
    highlights: [hl('less', ...rangeInclusive(1, mid)), hl('greater', ...rangeInclusive(mid + 1, n))],
  })
  mergeInto(b, 1, mid, n, 0)
  b.emit({
    codeBlock: 'merge',
    codeLine: null,
    action: { kind: 'done' },
    narration: 'המיזוג הושלם — מערך ממוין! 🎉',
    highlights: [hl('sorted', ...rangeInclusive(1, n))],
  })
  return b.build()
}

export const mergeSpec: AlgorithmSpec = {
  id: 'merge',
  titleHe: 'מיזוג — Merge',
  titleEn: 'Merge',
  kind: 'helper',
  helperOfHe: ['מיון מיזוג'],
  blurbHe:
    'הליבה של מיון מיזוג: מקבל שני חצאים כבר-ממוינים וממזג אותם למערך ממוין אחד בזמן לינארי, בעזרת מסלול פלט עזר.',
  complexity: '\\Theta(n)',
  proof: {
    result: '\\Theta(n)',
    claimHe: 'מיזוג שני חצאים שסכום גודלם n עולה Θ(n) — מעבר לינארי יחיד, ללא רקורסיה.',
    steps: [
      {
        he: 'הלולאה רצה בדיוק n = r−p+1 פעמים — בכל סיבוב נכנס איבר אחד לפלט:',
        tex: 'k = p, p+1, \\dots, r',
      },
      {
        he: 'כל סיבוב עושה עבודה קבועה: השוואה אחת והעברת איבר אחד:',
        tex: 'O(1)',
      },
      {
        he: 'גם ההעתקה בחזרה אל המערך היא n פעולות, ולכן בסך הכול:',
        tex: 'n \\cdot O(1) = \\Theta(n)',
      },
    ],
    intuitionHe:
      'בכל איבר "נוגעים" בדיוק פעם אחת — כשמעבירים אותו לפלט — ולכן העבודה פרופורציונית למספר האיברים. זה בדיוק ה-Θ(n) של כל רמה במיון מיזוג.',
  },
  pseudocode: [mergeBlock],
  views: ['custom'],
  customViz: MergeSortView,
  run: runMerge,
  validateInput: (raw) => parseIntArray(raw, { min: 2, max: 12 }),
  defaultInput: { array: [5, 2, 8, 1, 4, 9] },
  presets: [
    { labelHe: 'בסיסי', input: { array: [5, 2, 8, 1, 4, 9] } },
    {
      labelHe: 'חצי אחד נגמר מוקדם',
      input: { array: [1, 2, 3, 7, 8, 9] },
      noteHe: 'כל הקטנים בחצי השמאלי — הימני מועתק כולו בסוף.',
    },
    { labelHe: 'הימני קטן יותר', input: { array: [4, 5, 6, 1, 2, 3] } },
    {
      labelHe: 'שזירה — המקרה הגרוע ביותר',
      input: { array: [1, 3, 5, 2, 4, 6] },
      worst: true,
      noteHe: 'החצאים נשזרים לסירוגין → מירב ההשוואות במיזוג.',
    },
  ],
}
