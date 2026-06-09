import { FrameBuilder, vv } from '@/core/engine/FrameBuilder'
import type { Frame } from '@/core/engine/types'
import type { Item, KnapCell, KnapScene } from './knapsackScene'

/**
 * Frame stream for the 0-1 Knapsack DP demo: a fill phase (items × capacity) and
 * a traceback that recovers WHICH items were chosen. Pure & deterministic; the
 * grid lives entirely in `frame.scene`.
 */
export function runKnapsack(items: Item[], W: number): Frame[] {
  const k = items.length
  const b = new FrameBuilder([0])

  const K: (number | null)[][] = Array.from({ length: k + 1 }, () => Array<number | null>(W + 1).fill(null))
  for (let w = 0; w <= W; w++) K[0][w] = 0

  const snap = (extra: Partial<KnapScene>): KnapScene => ({
    kind: 'knap',
    items,
    W,
    k,
    K: K.map((row) => row.slice()),
    phase: 'fill',
    ...extra,
  })
  const emit = (codeLine: number | null, narration: string, scene: Partial<KnapScene>, vars?: ReturnType<typeof vv>[]) => {
    b.setScene(snap(scene))
    b.emit({ codeLine, narration, vars })
  }

  // ---- fill phase ----
  b.setBlock('knapsack01').setPhase('fill')
  emit(null, `נמלא טבלה K בגודל ${k + 1}×${W + 1}: K[i,w] = הערך המרבי משימוש ב-i הפריטים הראשונים עם קיבולת w. שורה 0 = 0.`, {})

  for (let i = 1; i <= k; i++) {
    const { w: wi, v: vi } = items[i - 1]
    for (let w = 0; w <= W; w++) {
      const cur: KnapCell = { i, j: w }
      const vars = [vv('i', i, 'i'), vv('w', w, 'j')]
      if (wi > w) {
        K[i][w] = K[i - 1][w]
        emit(6, `פריט ${i} (משקל ${wi}) כבד מהקיבולת ${w} — לא נכנס. מעתיקים מלמעלה: K[${i},${w}] = ${K[i][w]}.`, {
          cur,
          deps: [{ i: i - 1, j: w }],
          fits: false,
        }, [...vars, vv('ערך', K[i][w] as number, 'bound')])
      } else {
        const skip = K[i - 1][w] as number
        const take = vi + (K[i - 1][w - wi] as number)
        const val = Math.max(skip, take)
        K[i][w] = val
        emit(8, `קיבולת ${w}: לדלג על פריט ${i} → ${skip}, מול לקחת אותו → ${vi}+${K[i - 1][w - wi]}=${take}. בוחרים מקסימום: ${val}.`, {
          cur,
          deps: [
            { i: i - 1, j: w },
            { i: i - 1, j: w - wi },
          ],
          fits: true,
        }, [...vars, vv('ערך', val, 'bound')])
      }
    }
  }

  const best = K[k][W] as number
  emit(9, `הטבלה מלאה. הערך המרבי הוא K[${k},${W}] = ${best}. עלות המילוי: O(k·W).`, { cur: { i: k, j: W } }, [vv('ערך', best, 'bound')])

  // ---- traceback: which items were chosen ----
  b.setBlock('knapBack').setPhase('back')
  let i = k
  let w = W
  const taken: number[] = []
  const path: KnapCell[] = []
  let value = 0
  emit(2, `כעת משחזרים אילו פריטים נבחרו — מתחילים מ-K[${k},${W}] והולכים אחורה.`, { phase: 'back', path: [], taken: [], value: 0 })

  while (i > 0) {
    const cur: KnapCell = { i, j: w }
    path.push(cur)
    if (K[i][w] === K[i - 1][w]) {
      emit(5, `K[${i},${w}] = K[${i - 1},${w}] → פריט ${i} לא נלקח. עולים שורה.`, {
        phase: 'back',
        cur,
        path: path.slice(),
        arrow: { from: cur, to: { i: i - 1, j: w } },
        taken: [...taken].sort((a, c) => a - c),
        value,
      })
      i--
    } else {
      const wi = items[i - 1].w
      taken.push(i)
      value += items[i - 1].v
      emit(7, `פריט ${i} נלקח! (משקל ${wi}, ערך ${items[i - 1].v}). מורידים ${wi} מהקיבולת ועולים שורה.`, {
        phase: 'back',
        cur,
        path: path.slice(),
        arrow: { from: cur, to: { i: i - 1, j: w - wi } },
        taken: [...taken].sort((a, c) => a - c),
        value,
      }, [vv('ערך', value, 'bound')])
      w -= wi
      i--
    }
  }

  const chosen = [...taken].sort((a, c) => a - c)
  emit(2, `סיום. נבחרו פריטים {${chosen.join(', ')}} בערך כולל ${value}.`, {
    phase: 'back',
    path: path.slice(),
    taken: chosen,
    value,
  }, [vv('ערך', value, 'bound')])

  return b.build()
}

/** Reference 0-1 knapsack optimal value (for tests). */
export function knapsackValue(items: Item[], W: number): number {
  const k = items.length
  const K = Array.from({ length: k + 1 }, () => Array(W + 1).fill(0))
  for (let i = 1; i <= k; i++)
    for (let w = 0; w <= W; w++)
      K[i][w] = items[i - 1].w > w ? K[i - 1][w] : Math.max(K[i - 1][w], items[i - 1].v + K[i - 1][w - items[i - 1].w])
  return K[k][W]
}
