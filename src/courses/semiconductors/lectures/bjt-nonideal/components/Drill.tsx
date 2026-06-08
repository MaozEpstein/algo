import { useState, type ReactNode } from 'react'
import RichText from '@/core/components/RichText'

/** One generated instance of a drill: a values-filled prompt, the numeric answer
 *  (in the stated unit), and a worked solution shown on demand. */
export interface DrillVariant {
  given: string
  answer: number
  unit: string
  /** Accepted relative error (default 3%). */
  tol?: number
  solution: ReactNode
}

/**
 * A self-checking numeric drill: the learner types an answer, presses בדוק, and
 * gets ✓/✗ feedback against a tolerance; פתרון reveals the worked steps, and
 * תרגיל חדש cycles to the next set of numbers. Deterministic (index-based) so the
 * smoke test stays stable.
 */
export default function Drill({ title, variants }: { title: string; variants: DrillVariant[] }) {
  const [i, setI] = useState(0)
  const [val, setVal] = useState('')
  const [checked, setChecked] = useState(false)
  const [showSol, setShowSol] = useState(false)

  const v = variants[i % variants.length]
  const num = parseFloat(val.replace(',', '.'))
  const tol = v.tol ?? 0.03
  const ok = Number.isFinite(num) && Math.abs(num - v.answer) <= Math.abs(v.answer || 1) * tol

  const next = () => {
    setI((n) => n + 1)
    setVal('')
    setChecked(false)
    setShowSol(false)
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold text-slate-800"><RichText>{title}</RichText></p>
        <button onClick={next} className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100">
          תרגיל חדש ↻
        </button>
      </div>
      <p className="mt-1 leading-relaxed text-slate-600"><RichText>{v.given}</RichText></p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5">
          <input
            dir="ltr"
            inputMode="decimal"
            value={val}
            onChange={(e) => { setVal(e.target.value); setChecked(false) }}
            onKeyDown={(e) => { if (e.key === 'Enter') setChecked(true) }}
            placeholder="?"
            className="w-28 rounded-lg border border-slate-300 px-3 py-1.5 text-center font-mono text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
          <span className="font-mono text-sm text-slate-500">{v.unit}</span>
        </div>
        <button
          onClick={() => setChecked(true)}
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
        >
          בדוק
        </button>
        <button
          onClick={() => setShowSol((s) => !s)}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-50"
        >
          {showSol ? 'הסתר פתרון' : 'פתרון'}
        </button>
      </div>

      {checked && val !== '' && (
        <p className={`mt-2 text-sm font-semibold ${ok ? 'text-emerald-600' : 'text-rose-600'}`}>
          {ok ? '✓ נכון! כל הכבוד.' : `✗ לא מדויק — נסו שוב או הציצו בפתרון. (התשובה ≈ ${fmt(v.answer)} ${v.unit})`}
        </p>
      )}
      {showSol && <div className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">{v.solution}</div>}
    </div>
  )
}

function fmt(n: number): string {
  if (n !== 0 && (Math.abs(n) < 0.01 || Math.abs(n) >= 1e4)) return n.toPrecision(3)
  return String(Math.round(n * 1000) / 1000)
}
