import { useState, type ReactNode } from 'react'
import { usePrintMode } from '@/core/platform/printMode'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from './Panel'

/**
 * Shared practice building blocks for the statistics course, adapted from the
 * semiconductors PracticeTab. Every question is a REAL course problem
 * (recitation / homework / exam) and carries a `source` citation. Reused by each
 * lesson's PracticeTab so the exam-style look stays consistent.
 */

export const ACCENT = {
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  sky: 'bg-sky-50 text-sky-700 ring-sky-100',
  slate: 'bg-slate-50 text-slate-700 ring-slate-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  violet: 'bg-violet-50 text-violet-700 ring-violet-100',
  rose: 'bg-rose-50 text-rose-700 ring-rose-100',
}

const HEB = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח']

export type Part =
  | { kind: 'numeric'; prompt: string; tex: string; sub?: string; res: ReactNode; accent: string; note?: ReactNode; sketch?: () => ReactNode }
  | { kind: 'concept'; prompt: string; answer: ReactNode; sketch?: () => ReactNode }
  | { kind: 'sketch'; prompt: string; render: () => ReactNode }

/** The "שאלה" prompt box (exam-style). `source` cites where the question came from. */
export function QuestionBlock({ source, children }: { source?: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-white">שאלה</span>
        {source && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
            {source}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

const labelCls = 'w-14 shrink-0 rounded bg-slate-100 py-0.5 text-center text-xs font-semibold text-slate-500'

function PartCard({ part, index, open, onToggle }: { part: Part; index: number; open: boolean; onToggle: () => void }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <button onClick={onToggle} aria-expanded={open} className="flex w-full items-center gap-2 px-4 py-3 text-start transition hover:bg-slate-50">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-700 text-xs font-bold text-white">{HEB[index]}</span>
        <span className="text-sm font-medium text-slate-700"><RichText>{part.prompt}</RichText></span>
        <svg className={`ms-auto h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4">
          {part.kind === 'numeric' && (
            <div className="space-y-2">
              <div className="flex flex-wrap items-baseline gap-2.5">
                <span className={`${labelCls} text-slate-400`}>נוסחה</span>
                <span className="ltr text-slate-600" dir="ltr"><Tex>{part.tex}</Tex></span>
              </div>
              {part.sub && (
                <div className="flex flex-wrap items-baseline gap-2.5">
                  <span className={labelCls}>הצבה</span>
                  <span className="ltr text-slate-700" dir="ltr"><Tex>{part.sub}</Tex></span>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={labelCls}>תוצאה</span>
                <span className={`rounded-lg px-3 py-1 font-mono text-sm font-bold ring-1 ${part.accent}`} dir="ltr">{part.res}</span>
              </div>
              {part.note && (
                <p className="rounded-lg bg-emerald-50/70 px-3 py-2 text-sm leading-relaxed text-emerald-900">💡 {part.note}</p>
              )}
            </div>
          )}
          {part.kind === 'concept' && (
            <div className="flex flex-wrap items-baseline gap-2.5">
              <span className={labelCls}>תשובה</span>
              <span className="text-sm leading-relaxed text-slate-600">{part.answer}</span>
            </div>
          )}
          {part.kind === 'sketch' && (
            <div className="space-y-1.5">
              <span className="inline-block rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">כך זה צריך להיראות ✏️</span>
              <div className="rounded-xl border border-slate-200 bg-white p-2">{part.render()}</div>
            </div>
          )}
          {part.kind !== 'sketch' && part.sketch && (
            <div className="mt-3 space-y-1.5">
              <span className="inline-block rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">כך זה צריך להיראות ✏️</span>
              <div className="rounded-xl border border-slate-200 bg-white p-2">{part.sketch()}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function Parts({ parts }: { parts: Part[] }) {
  const printing = usePrintMode()
  const [open, setOpen] = useState<boolean[]>(() => parts.map(() => printing))
  const allOpen = open.every(Boolean)
  const toggleAll = () => setOpen(parts.map(() => !allOpen))
  const toggleOne = (i: number) => setOpen((prev) => prev.map((v, k) => (k === i ? !v : v)))
  return (
    <>
      <div className="mt-4 flex items-center gap-2">
        <button onClick={toggleAll} aria-expanded={allOpen} className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-emerald-700">
          פתרון
          <svg className={`h-3.5 w-3.5 transition-transform ${allOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        <span className="shrink-0 text-xs text-slate-400">נסו לבד — ואז «פתרון» פותח/סוגר את כל הסעיפים</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <div className="mt-3 flex flex-col gap-2.5">
        {parts.map((p, i) => (
          <PartCard key={i} part={p} index={i} open={open[i]} onToggle={() => toggleOne(i)} />
        ))}
      </div>
    </>
  )
}

export type TFormula = { name: string; tex: string }

/** Collapsible "📐 נוסחאות" toolbox for a question. Closed by default; opens when printing. */
export function FormulaList({ formulas }: { formulas: TFormula[] }) {
  const [open, setOpen] = useState(usePrintMode())
  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100"
      >
        <span aria-hidden>📐</span>
        נוסחאות לשאלה
        <svg className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="mt-3 overflow-hidden rounded-xl border border-indigo-100 bg-indigo-50/40">
          {formulas.map((f, i) => (
            <div key={i} className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2.5 ${i ? 'border-t border-indigo-100' : ''}`}>
              <span className="text-sm font-semibold text-slate-700">{f.name}</span>
              <span className="ltr text-slate-800" dir="ltr"><Tex>{f.tex}</Tex></span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function Problem({ titleHe, source, children, parts, formulas }: { titleHe: string; source?: string; children: ReactNode; parts: Part[]; formulas?: TFormula[] }) {
  return (
    <Panel title={titleHe}>
      <QuestionBlock source={source}>{children}</QuestionBlock>
      {formulas && <FormulaList formulas={formulas} />}
      <Parts parts={parts} />
    </Panel>
  )
}

/** Quick self-check: a question with a reveal-answer toggle. */
export function QA({ q, children }: { q: string; children: ReactNode }) {
  const [show, setShow] = useState(usePrintMode())
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold text-slate-800"><RichText>{q}</RichText></p>
        <button onClick={() => setShow((s) => !s)} aria-expanded={show} className="shrink-0 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100">
          {show ? 'הסתר תשובה' : 'הצג תשובה'}
        </button>
      </div>
      {show && <div className="mt-2 leading-relaxed text-slate-600">{children}</div>}
    </div>
  )
}
