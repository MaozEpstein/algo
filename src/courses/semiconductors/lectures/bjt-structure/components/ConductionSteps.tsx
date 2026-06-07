import { useState, type ReactNode } from 'react'
import Tex from '@/core/components/Tex'

/**
 * Interactive walkthrough of the forward-active CONDUCTION mechanism: three clickable
 * stages — injection (BE) → diffusion (base) → collection (BC). Selecting a stage
 * highlights it, shows a fuller explanation, and circles the region letter (E/B/C) in
 * the accent colour (consistent with BjtOperationFlow / BjtStructure). Self-contained.
 */
function CircledLetter({ children, dim }: { children: ReactNode; dim?: boolean }) {
  return (
    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-extrabold text-white transition ${dim ? 'bg-violet-300' : 'bg-violet-600'}`} dir="ltr">
      {children}
    </span>
  )
}

const STAGES = [
  {
    letter: 'E', verb: 'הזרקה', tag: 'צומת B-E — קדמי', tone: 'border-emerald-300 bg-emerald-50/60',
    detail: (
      <>
        צומת ה-<b>BE</b> ב<b>ממתח קדמי</b> (<Tex>{'V_{BE}>0'}</Tex>) <b>מנמיך את המחסום</b> שם, והפולט המסומם-בכבדות
        <b> מזריק</b> אלקטרוני-מיעוט אל הבסיס. ככל שה-<Tex>{'V_{BE}'}</Tex> גבוה יותר, ההזרקה (והזרם) גדלים מעריכית.
      </>
    ),
  },
  {
    letter: 'B', verb: 'דיפוזיה', tag: 'בסיס דק', tone: 'border-sky-300 bg-sky-50/60',
    detail: (
      <>
        הבסיס <b>דק מאוד</b> (<Tex>{'W_B\\ll L_B'}</Tex>), ולכן האלקטרונים <b>חוצים אותו בדיפוזיה כמעט במלואם</b> —
        רק שבריר זעיר נעלם ברקומבינציה (וזהו חלק מזרם-הבסיס הקטן).
      </>
    ),
  },
  {
    letter: 'C', verb: 'קליטה', tag: 'צומת C-B — אחורי', tone: 'border-violet-300 bg-violet-50/60',
    detail: (
      <>
        צומת ה-<b>CB</b> ב<b>ממתח אחורי</b> (<Tex>{'V_{BC}<0'}</Tex>) יוצר <b>מורד תלול</b> ש<b>קולט</b> את כל
        האלקטרונים שהגיעו — וזהו <b>זרם-הקולט</b> <Tex>{'I_C\\approx\\beta I_B'}</Tex>.
      </>
    ),
  },
]

export default function ConductionSteps() {
  const [sel, setSel] = useState(0)
  return (
    <div className="mt-3 flex flex-col gap-3">
      <div className="flex flex-wrap items-stretch justify-center gap-2">
        {STAGES.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-2xl font-bold text-violet-300" aria-hidden>←</span>}
            <button
              onClick={() => setSel(i)}
              aria-pressed={sel === i}
              className={`flex w-36 flex-col items-center gap-1 rounded-xl border px-3 py-3 text-center transition ${
                sel === i ? `${s.tone} shadow-sm` : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <CircledLetter dim={sel !== i}>{s.letter}</CircledLetter>
              <span className={`text-sm font-bold ${sel === i ? 'text-slate-800' : 'text-slate-600'}`}>{i + 1} · {s.verb}</span>
              <span className="text-[11px] font-medium text-slate-400">{s.tag}</span>
            </button>
          </div>
        ))}
      </div>
      <div className={`rounded-xl border-s-4 p-3 text-sm leading-relaxed text-slate-700 ${STAGES[sel].tone}`}>
        <span className="me-1 font-bold text-slate-800">{STAGES[sel].verb}:</span>
        {STAGES[sel].detail}
      </div>
    </div>
  )
}
