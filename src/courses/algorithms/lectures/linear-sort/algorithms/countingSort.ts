import { FrameBuilder, vi, vv } from '@/core/engine/FrameBuilder'
import { parseIntArray } from '@/core/engine/parseInput'
import type { AlgorithmInput, AlgorithmSpec, Frame } from '@/core/engine/types'
import { countingSortBlock } from '../pseudocode'
import { CELL, PITCH, type FlowBox, type FlowChip, type FlowScene } from '../scene'

const AY = 24 // input row
const CY = 138 // count row
const BY = 252 // output row
const xOf = (i: number) => (i - 1) * PITCH // i is 1-indexed

interface El {
  value: number
  id: string
  lane: 'A' | 'B'
  pos: number // 1-indexed slot in its lane
}

/**
 * Counting Sort (CLRS, keys in 1..k). Not in place, **stable**: placing from
 * j=n downto 1 sends equal keys to descending output slots, preserving input
 * order. Carries the full A / C / B layout in `Frame.scene` for FlowView; the
 * chip flying from A into B is the "see it" of where each key lands. O(n+k).
 */
export function runCountingSort(input: AlgorithmInput): Frame[] {
  const vals = input.array
  const n = vals.length
  const k = Math.max(1, ...vals)
  const b = new FrameBuilder(vals)
  const els: El[] = vals.map((v, i) => ({
    value: v,
    id: b.elementIdAt(i + 1),
    lane: 'A',
    pos: i + 1,
  }))
  const C = new Array(k + 1).fill(0)
  const width = Math.max(n, k) * PITCH
  const height = BY + CELL + 24

  const scene = (opts: {
    ptrA?: number // A index being read (1-indexed)
    activeVal?: number // active count bin (key value)
    ptrB?: number // target output slot
    cLabel?: string // heading for the C row (its current meaning)
    cShown?: number // how many C cells have been created so far (default: all k)
  }): FlowScene => {
    const cShown = opts.cShown ?? k
    const boxes: FlowBox[] = []
    for (let i = 1; i <= n; i++)
      boxes.push({ x: xOf(i), y: AY, w: CELL, h: CELL, tone: 'lane', labelTop: i === 1 ? 'A · קלט' : undefined })
    for (let v = 1; v <= cShown; v++)
      boxes.push({
        x: xOf(v),
        y: CY,
        w: CELL,
        h: CELL,
        tone: opts.activeVal === v ? 'active' : 'count',
        value: String(C[v]),
        labelTop: v === 1 ? (opts.cLabel ?? 'C') : undefined,
        labelBottom: `=${v}`,
      })
    for (let i = 1; i <= n; i++)
      boxes.push({
        x: xOf(i),
        y: BY,
        w: CELL,
        h: CELL,
        tone: 'output',
        labelTop: i === 1 ? 'B · פלט' : undefined,
        labelBottom: opts.ptrB === i ? '▲' : undefined,
      })

    const chips: FlowChip[] = els.map((e) => {
      const inA = e.lane === 'A'
      const tone: FlowChip['tone'] = !inA
        ? 'done'
        : opts.ptrA === e.pos
          ? 'active'
          : 'idle'
      return { id: e.id, label: String(e.value), x: xOf(e.pos), y: inA ? AY : BY, tone }
    })
    return { kind: 'flow', width, height, boxes, chips }
  }

  b.setBlock('countingSort')

  b.setPhase('אתחול')
  b.emit({
    codeLine: 2,
    narration: `יוצרים מערך עזר חדש C באורך k=${k} — תא אחד לכל ערך מפתח אפשרי (1..${k}), ולא לכל איבר בקלט. (לכן |C|=k, בעוד |A|=|B|=n=${n}.) התאים ייווצרו אחד-אחד:`,
    scene: scene({ cLabel: 'C · נוצר', cShown: 0 }),
    vars: [vv('k', k, 'bound'), vv('n', n, 'bound')],
  })
  for (let i = 1; i <= k; i++) {
    b.emit({
      codeLine: 3,
      narration: `נוצר תא חדש ומאותחל לאפס: C[${i}] = 0.`,
      scene: scene({ activeVal: i, cLabel: 'C · נוצר', cShown: i }),
      vars: [vv('k', k, 'bound'), vi('i', i, 'i')],
    })
  }

  // 1) count occurrences
  b.setPhase('ספירה')
  for (let j = 1; j <= n; j++) {
    const v = b.value(j)
    C[v] += 1
    b.emit({
      codeLine: 5,
      narration: `סופרים: A[${j}]=${v} ⇐ מגדילים את C[${v}] ל-${C[v]}.`,
      scene: scene({ ptrA: j, activeVal: v, cLabel: 'C · מונים' }),
      vars: [vv('k', k, 'bound'), vi('j', j, 'i'), vv('v', v, 'pivot'), vv('C[v]', C[v], 'k')],
    })
  }

  // 2) prefix sums → C[v] = how many keys are ≤ v = last output slot for key v
  b.setPhase('סכומי-רישא')
  for (let v = 2; v <= k; v++) {
    C[v] = C[v] + C[v - 1]
    b.emit({
      codeLine: 7,
      narration: `סכומי-רישא: C[${v}] += C[${v - 1}] ⇒ C[${v}]=${C[v]} = כמה איברים ≤ ${v} (האינדקס האחרון בפלט עבור ${v}).`,
      scene: scene({ activeVal: v, cLabel: 'C · סכומי-רישא' }),
      vars: [vv('k', k, 'bound'), vv('v', v, 'pivot'), vv('C[v]', C[v], 'k')],
    })
  }

  // 3) place each key into B, scanning right→left (this is what makes it stable)
  b.setPhase('הצבה')
  for (let j = n; j >= 1; j--) {
    const el = els[j - 1]
    const v = el.value
    const target = C[v]
    b.emit({
      codeLine: 9,
      narration: `מציבים מימין לשמאל: A[${j}]=${v} → B[${target}] (כי C[${v}]=${target}).`,
      scene: scene({ ptrA: j, activeVal: v, ptrB: target, cLabel: 'C · סכומי-רישא' }),
      vars: [
        vv('k', k, 'bound'),
        vi('j', j, 'i'),
        vv('v', v, 'pivot'),
        vv('C[v]', C[v], 'k'),
        vv('B-pos', target, 'bound'),
      ],
    })
    el.lane = 'B'
    el.pos = target
    C[v] -= 1
    b.emit({
      codeLine: 10,
      narration: `מקטינים C[${v}] ל-${C[v]} — כך ${v} הבא יישב שמאלה יותר, והסדר נשמר (יציב).`,
      scene: scene({ activeVal: v, cLabel: 'C · סכומי-רישא' }),
      vars: [vv('k', k, 'bound'), vv('v', v, 'pivot'), vv('C[v]', C[v], 'k')],
    })
  }

  b.setPhase('סיום')
  b.emit({
    codeLine: null,
    action: { kind: 'done' },
    narration: 'סיום — B ממוין! ספרנו וחילקנו בלי שום השוואה: O(n+k).',
    scene: scene({ cLabel: 'C' }),
    vars: [vv('k', k, 'bound')],
  })
  return b.build()
}

/** The sorted output read from the final frame's B lane (chips on the B row),
 *  left→right. Used by tests. */
export function countingResult(frames: Frame[]): number[] {
  const scene = frames[frames.length - 1].scene as FlowScene
  return scene.chips
    .filter((c) => c.y === BY)
    .sort((a, z) => a.x - z.x)
    .map((c) => Number(c.label))
}

export const countingSortSpec: AlgorithmSpec = {
  id: 'countingSort',
  titleHe: 'מיון מנייה',
  titleEn: 'CountingSort',
  kind: 'main',
  blurbHe:
    'מיון ללא השוואות לקלט שלם בטווח 1..k: סופרים הופעות, הופכים לסכומי-רישא, ומציבים כל איבר במקומו בפלט. יציב, אך לא במקום.',
  complexity: 'O(n + k)',
  proof: {
    result: 'O(n + k)',
    claimHe: 'מיון מנייה רץ ב-O(n+k); כש-k = O(n) זה O(n) — לינארי, ושובר את חסם ה-Ω(n log n).',
    steps: [
      { he: 'איפוס המונים — מעבר על k התאים:', tex: 'O(k)' },
      { he: 'ספירת ההופעות — מעבר אחד על n האיברים:', tex: 'O(n)' },
      { he: 'סכומי-רישא — מעבר על k התאים:', tex: 'O(k)' },
      { he: 'הצבה לפלט — מעבר אחד על n האיברים:', tex: 'O(n)' },
      { he: 'סיכום ארבעת המעברים:', tex: 'O(k) + O(n) + O(k) + O(n) = O(n + k)' },
    ],
    intuitionHe:
      'אין השוואות — לכן חסם ה-Ω(n log n) (שתקף רק למיוני השוואה) לא חל. המחיר: זיכרון נוסף בגודל k, ולכן זה משתלם רק כשטווח המפתחות קטן.',
  },
  pseudocode: [countingSortBlock],
  run: runCountingSort,
  validateInput: (raw) => parseIntArray(raw, { min: 2, max: 8, minValue: 1, maxValue: 6 }),
  defaultInput: { array: [3, 1, 2, 3, 1, 2] },
}
