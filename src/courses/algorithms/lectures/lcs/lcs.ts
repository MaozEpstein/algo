import { FrameBuilder, vv } from '@/core/engine/FrameBuilder'
import type { Frame } from '@/core/engine/types'
import type { Cell, LcsScene } from './lcsScene'

/**
 * Build the frame stream for the LCS dynamic-programming demo: a fill phase
 * (row-major over the c table) followed by a traceback that recovers the actual
 * subsequence. Pure & deterministic. The grid lives entirely in `frame.scene`;
 * the FrameBuilder array is unused scaffolding.
 */
export function runLcs(X: string, Y: string): Frame[] {
  const m = X.length
  const n = Y.length
  const b = new FrameBuilder([0])

  // c[0..m][0..n], base row/column = 0, rest null until computed.
  const c: (number | null)[][] = Array.from({ length: m + 1 }, () => Array<number | null>(n + 1).fill(null))
  for (let i = 0; i <= m; i++) c[i][0] = 0
  for (let j = 0; j <= n; j++) c[0][j] = 0

  const snap = (extra: Partial<LcsScene>): LcsScene => ({
    kind: 'lcs',
    X,
    Y,
    m,
    n,
    c: c.map((row) => row.slice()),
    phase: 'fill',
    ...extra,
  })
  const emit = (codeLine: number | null, narration: string, scene: Partial<LcsScene>, vars?: ReturnType<typeof vv>[]) => {
    b.setScene(snap(scene))
    b.emit({ codeLine, narration, vars })
  }

  // ---- fill phase ----
  b.setBlock('lcsLength').setPhase('fill')
  emit(null, `נמלא טבלה c בגודל ${m + 1}×${n + 1}. שורה/עמודה 0 מאותחלות ל-0 (תת-סדרה עם מחרוזת ריקה היא ריקה).`, {})

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cur: Cell = { i, j }
      const match = X[i - 1] === Y[j - 1]
      const vars = [vv('i', i, 'i'), vv('j', j, 'j')]
      if (match) {
        const val = (c[i - 1][j - 1] as number) + 1
        c[i][j] = val
        emit(7, `X[${i}]=Y[${j}]='${X[i - 1]}' — התאמה! לוקחים את האלכסון ומוסיפים 1: c[${i},${j}] = ${val - 1}+1 = ${val}.`, {
          cur,
          deps: [{ i: i - 1, j: j - 1 }],
          match: true,
        }, [...vars, vv('c', val, 'bound')])
      } else {
        const up = c[i - 1][j] as number
        const left = c[i][j - 1] as number
        const val = Math.max(up, left)
        c[i][j] = val
        emit(8, `'${X[i - 1]}'≠'${Y[j - 1]}' — אין התאמה. לוקחים את המקסימום מלמעלה (${up}) ומשמאל (${left}): c[${i},${j}] = ${val}.`, {
          cur,
          deps: [
            { i: i - 1, j },
            { i, j: j - 1 },
          ],
          match: false,
        }, [...vars, vv('c', val, 'bound')])
      }
    }
  }

  const len = c[m][n] as number
  emit(9, `הטבלה מלאה. אורך תת-הסדרה המשותפת הארוכה ביותר הוא c[${m},${n}] = ${len}. עלות המילוי: O(m·n).`, {
    cur: { i: m, j: n },
  }, [vv('אורך', len, 'bound')])

  // ---- traceback phase ----
  b.setBlock('printLcs').setPhase('back')
  let i = m
  let j = n
  const path: Cell[] = []
  const letters: string[] = [] // collected in reverse, fixed at the end
  emit(1, `כעת משחזרים את תת-הסדרה עצמה — מתחילים מ-c[${m},${n}] והולכים אחורה.`, { phase: 'back', path: [], lcs: '' })

  while (i > 0 && j > 0) {
    const cur: Cell = { i, j }
    path.push(cur)
    const lcsSoFar = [...letters].reverse().join('')
    if (X[i - 1] === Y[j - 1]) {
      letters.push(X[i - 1])
      emit(4, `X[${i}]=Y[${j}]='${X[i - 1]}' — אות זו שייכת ל-LCS! רושמים אותה ועוברים באלכסון.`, {
        phase: 'back',
        cur,
        path: path.slice(),
        arrow: { from: cur, to: { i: i - 1, j: j - 1 } },
        lcs: [...letters].reverse().join(''),
      })
      i--
      j--
    } else if ((c[i - 1][j] as number) >= (c[i][j - 1] as number)) {
      emit(6, `אין התאמה; c[${i - 1},${j}] ≥ c[${i},${j - 1}] → עולים למעלה.`, {
        phase: 'back',
        cur,
        path: path.slice(),
        arrow: { from: cur, to: { i: i - 1, j } },
        lcs: lcsSoFar,
      })
      i--
    } else {
      emit(7, `אין התאמה; c[${i},${j - 1}] גדול יותר → פונים שמאלה.`, {
        phase: 'back',
        cur,
        path: path.slice(),
        arrow: { from: cur, to: { i, j: j - 1 } },
        lcs: lcsSoFar,
      })
      j--
    }
  }

  const lcs = [...letters].reverse().join('')
  emit(2, `הגענו לגבול הטבלה. תת-הסדרה המשותפת הארוכה ביותר היא "${lcs}" (אורך ${lcs.length}).`, {
    phase: 'back',
    path: path.slice(),
    lcs,
  }, [vv('אורך', lcs.length, 'bound')])

  return b.build()
}

/** Reference LCS length (for tests / sanity). */
export function lcsLength(X: string, Y: string): number {
  const m = X.length
  const n = Y.length
  const c = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      c[i][j] = X[i - 1] === Y[j - 1] ? c[i - 1][j - 1] + 1 : Math.max(c[i - 1][j], c[i][j - 1])
  return c[m][n]
}
