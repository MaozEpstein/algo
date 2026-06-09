import { useMemo, useState } from 'react'
import LocalPlayer from '@/core/shell/LocalPlayer'
import { runKnapsack } from '../knapsack'
import { isKnapScene, type Item } from '../knapsackScene'
import { knapsack01Block, knapBackBlock } from '../pseudocode'
import KnapsackGridView from '../views/KnapsackGridView'
import type { Frame } from '@/core/engine/types'

interface Preset {
  labelHe: string
  items: Item[]
  W: number
  noteHe?: string
}
const SLIDE: Item[] = [
  { w: 1, v: 8 },
  { w: 3, v: 6 },
  { w: 5, v: 5 },
]
const PRESETS: Preset[] = [
  { labelHe: 'דוגמת השיעור (W=8)', items: SLIDE, W: 8, noteHe: 'פריטים (1,8),(3,6),(5,5). הבחירה הטובה: {1,2} בערך 14.' },
  { labelHe: 'קיבולת מצומצמת (W=3)', items: SLIDE, W: 3, noteHe: 'עכשיו לא הכול נכנס — לפעמים עדיף פריט יחיד יקר.' },
  { labelHe: 'ארבעה פריטים (W=10)', items: [{ w: 2, v: 3 }, { w: 3, v: 4 }, { w: 4, v: 5 }, { w: 5, v: 8 }], W: 10, noteHe: 'יותר שילובים — ה-DP בודק את כולם ביעילות.' },
  { labelHe: 'משקלים שווים (W=6)', items: [{ w: 2, v: 5 }, { w: 2, v: 3 }, { w: 2, v: 4 }], W: 6, noteHe: 'אותו משקל — בוחרים לפי הערך.' },
]

function deriveSteps(frames: Frame[]): { label: string; index: number }[] {
  const steps: { label: string; index: number }[] = []
  let lastRow = -1
  let backStarted = false
  frames.forEach((f, idx) => {
    const s = f.scene
    if (!isKnapScene(s)) return
    if (s.phase === 'fill' && s.cur && s.cur.j === 0 && s.cur.i !== lastRow) {
      lastRow = s.cur.i
      steps.push({ label: `פריט ${s.cur.i}`, index: idx })
    } else if (s.phase === 'back' && !backStarted) {
      backStarted = true
      steps.push({ label: 'שחזור', index: idx })
    }
  })
  return steps
}

export default function KnapsackDemo() {
  const [preset, setPreset] = useState(PRESETS[0])
  const frames = useMemo(() => runKnapsack(preset.items, preset.W), [preset])
  const steps = useMemo(() => deriveSteps(frames), [frames])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-400">דוגמאות:</span>
        {PRESETS.map((p) => (
          <button
            key={p.labelHe}
            onClick={() => setPreset(p)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
              preset.labelHe === p.labelHe ? 'border-sky-500 bg-sky-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            {p.labelHe}
          </button>
        ))}
      </div>
      {preset.noteHe && <p className="text-sm text-slate-500">{preset.noteHe}</p>}
      <LocalPlayer
        key={preset.labelHe}
        frames={frames}
        pseudocode={[knapsack01Block, knapBackBlock]}
        titleHe="תרמיל 0-1 — תכנון דינמי"
        views={['custom']}
        customViz={KnapsackGridView}
        steps={steps}
        varsPlacement="side"
      />
    </div>
  )
}
