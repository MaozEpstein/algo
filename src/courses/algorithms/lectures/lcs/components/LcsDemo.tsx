import { useMemo, useState } from 'react'
import LocalPlayer from '@/core/shell/LocalPlayer'
import { runLcs } from '../lcs'
import { isLcsScene } from '../lcsScene'
import { lcsLengthBlock, printLcsBlock } from '../pseudocode'
import LcsGridView from '../views/LcsGridView'
import type { Frame } from '@/core/engine/types'

interface Preset {
  labelHe: string
  X: string
  Y: string
  noteHe?: string
}
const PRESETS: Preset[] = [
  { labelHe: 'דוגמת השיעור', X: 'ABCB', Y: 'BDCAB', noteHe: 'X=ABCB, Y=BDCAB → LCS באורך 3 (למשל BCB).' },
  { labelHe: 'DNA', X: 'AGCAT', Y: 'GAC', noteHe: 'השוואת רצפי DNA — יישום קלאסי.' },
  { labelHe: 'התאמה מלאה', X: 'ABCD', Y: 'ABCD', noteHe: 'מחרוזות זהות → ה-LCS הוא כל המחרוזת (אלכסון).' },
  { labelHe: 'ללא התאמה', X: 'ABC', Y: 'XYZ', noteHe: 'אין אות משותפת → LCS באורך 0.' },
]

/** Sanitize to uppercase letters, max 8 chars. */
const clean = (s: string) => s.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8)

/** High-level steps: one chip per filled row + one for the traceback. */
function deriveSteps(frames: Frame[]): { label: string; index: number; ltr?: boolean }[] {
  const steps: { label: string; index: number; ltr?: boolean }[] = []
  let lastRow = -1
  let backStarted = false
  frames.forEach((f, idx) => {
    const s = f.scene
    if (!isLcsScene(s)) return
    if (s.phase === 'fill' && s.cur && s.cur.j === 1 && s.cur.i !== lastRow) {
      lastRow = s.cur.i
      steps.push({ label: `שורה ${s.cur.i}`, index: idx })
    } else if (s.phase === 'back' && !backStarted) {
      backStarted = true
      steps.push({ label: 'שחזור', index: idx })
    }
  })
  return steps
}

export default function LcsDemo() {
  const [X, setX] = useState('ABCB')
  const [Y, setY] = useState('BDCAB')
  const frames = useMemo(() => runLcs(X, Y), [X, Y])
  const steps = useMemo(() => deriveSteps(frames), [frames])
  const activePreset = PRESETS.find((p) => p.X === X && p.Y === Y)
  const inputCls = 'ltr w-36 rounded-xl border border-slate-300 px-3 py-2 font-mono text-sm uppercase tracking-widest outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100'

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <label className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-emerald-600">X =</span>
          <input dir="ltr" value={X} onChange={(e) => setX(clean(e.target.value))} className={inputCls} placeholder="ABC" />
        </label>
        <label className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-sky-600">Y =</span>
          <input dir="ltr" value={Y} onChange={(e) => setY(clean(e.target.value))} className={inputCls} placeholder="ABC" />
        </label>
        <span className="text-xs text-slate-400">(אותיות באנגלית, עד 8)</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-400">דוגמאות:</span>
        {PRESETS.map((p) => (
          <button
            key={p.labelHe}
            onClick={() => { setX(p.X); setY(p.Y) }}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
              activePreset?.labelHe === p.labelHe ? 'border-sky-500 bg-sky-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            {p.labelHe}
          </button>
        ))}
      </div>
      {activePreset?.noteHe && <p className="text-sm text-slate-500">{activePreset.noteHe}</p>}

      {X.length > 0 && Y.length > 0 ? (
        <LocalPlayer
          key={`${X}|${Y}`}
          frames={frames}
          pseudocode={[lcsLengthBlock, printLcsBlock]}
          titleHe="LCS — תכנון דינמי"
          views={['custom']}
          customViz={LcsGridView}
          steps={steps}
          varsPlacement="side"
        />
      ) : (
        <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-700">הזינו שתי מחרוזות לא-ריקות.</p>
      )}
    </div>
  )
}
