import { useState, type ReactNode } from 'react'

/**
 * Interactive one-line summary of BJT operation: "take the charge from Ⓔ, pass it to
 * Ⓑ, and collect it at Ⓒ." Three clickable stages (E→B→C) reveal what each region
 * does. The English letters are circled badges in an accent colour.
 */
function CircledLetter({ children, dim }: { children: ReactNode; dim?: boolean }) {
  return (
    <span
      className={`mx-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-extrabold text-white align-middle transition ${
        dim ? 'bg-violet-300' : 'bg-violet-600'
      }`}
      dir="ltr"
    >
      {children}
    </span>
  )
}

const STAGES = [
  { letter: 'E', verb: 'לקיחה', he: <>ה<b>פולט</b> לוקח — <b>מזריק</b> את המטען (נושאי-מיעוט) אל הבסיס.</> },
  { letter: 'B', verb: 'העברה', he: <>ה<b>בסיס</b> הדק <b>מעביר</b> את המטען בדיפוזיה — כמעט כולו עובר לפני שייעלם ברקומבינציה.</> },
  { letter: 'C', verb: 'קליטה', he: <>המטען שחצה <b>נקלט</b> ב<b>קולט</b> — וזהו <b>זרם-הקולט</b>.</> },
]

export default function BjtOperationFlow() {
  const [sel, setSel] = useState(0)

  return (
    <div className="flex flex-col gap-4">
      {/* the sentence */}
      <p className="text-center text-base leading-relaxed text-slate-700">
        בקצרה, הטרנזיסטור <b>לוקח</b> את המטען מ-<CircledLetter>E</CircledLetter>, <b>מעביר</b> אותו ל-<CircledLetter>B</CircledLetter>,
        ו<b>קולט</b> אותו ב-<CircledLetter>C</CircledLetter>.
      </p>

      {/* interactive stages E → B → C */}
      <div className="ltr flex items-stretch justify-center gap-2" dir="ltr">
        {STAGES.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-2xl font-bold text-violet-300" aria-hidden>→</span>}
            <button
              onClick={() => setSel(i)}
              aria-pressed={sel === i}
              className={`flex w-28 flex-col items-center gap-1 rounded-xl border px-3 py-3 text-center transition ${
                sel === i ? 'border-violet-400 bg-violet-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <CircledLetter dim={sel !== i}>{s.letter}</CircledLetter>
              <span className={`text-sm font-bold ${sel === i ? 'text-violet-800' : 'text-slate-600'}`}>{s.verb}</span>
            </button>
          </div>
        ))}
      </div>

      {/* detail for the selected stage */}
      <div className="rounded-xl border-s-4 border-violet-300 bg-violet-50/50 p-3 text-sm leading-relaxed text-slate-700">
        <span className="me-1 font-bold text-violet-700">{STAGES[sel].verb}:</span>
        {STAGES[sel].he}
      </div>
    </div>
  )
}
