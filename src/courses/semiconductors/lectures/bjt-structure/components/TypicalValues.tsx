import { useState, type ReactNode } from 'react'
import Tex from '@/core/components/Tex'

/**
 * Interactive "typical values" panel for a silicon npn BJT: a grid of colour-coded
 * stat cards (symbol + value + role); clicking a card reveals WHY that value is chosen.
 * Self-contained.
 */
interface Stat { sym: string; value: ReactNode; label: string; accent: keyof typeof ACCENT; why: ReactNode }

const ACCENT = {
  sky: { card: 'border-sky-200 bg-sky-50', sel: 'ring-sky-400', text: 'text-sky-700' },
  rose: { card: 'border-rose-200 bg-rose-50', sel: 'ring-rose-400', text: 'text-rose-700' },
  violet: { card: 'border-violet-200 bg-violet-50', sel: 'ring-violet-400', text: 'text-violet-700' },
  emerald: { card: 'border-emerald-200 bg-emerald-50', sel: 'ring-emerald-400', text: 'text-emerald-700' },
}

const STATS: Stat[] = [
  { sym: 'N_E', value: <Tex>{'{\\sim}10^{19}'}</Tex>, label: 'פולט · סימום כבד', accent: 'sky', why: <>הפולט מסומם בכבדות כדי שההזרקה לבסיס תהיה יעילה — נצילות-הזרקה <Tex>{'\\gamma\\to1'}</Tex>.</> },
  { sym: 'N_B', value: <Tex>{'{\\sim}10^{17}'}</Tex>, label: 'בסיס · סימום קל', accent: 'rose', why: <>הבסיס קל-סימום כדי שההזרקה-הנגדית מהבסיס לפולט תהיה זניחה.</> },
  { sym: 'N_C', value: <Tex>{'{\\sim}10^{16}'}</Tex>, label: 'קולט · בינוני/קל', accent: 'sky', why: <>סימום נמוך פורש אזור-מחסור רחב ב-C-B, כדי לעמוד במתח-האחורי הגדול.</> },
  { sym: 'W_B', value: <Tex>{'{\\sim}0.1\\!-\\!1\\,\\mu m'}</Tex>, label: 'רוחב-בסיס · דק!', accent: 'violet', why: <>דק מאוד (<Tex>{'\\ll L_B'}</Tex>) כדי שכמעט כל המטען יחצה את הבסיס — מקדם-מעבר <Tex>{'b\\to1'}</Tex>.</> },
  { sym: 'L_B', value: <>עשרות <Tex>{'\\mu m'}</Tex></>, label: 'אורך-דיפוזיה', accent: 'sky', why: <>המרחק שאלקטרון נע בבסיס לפני רקומבינציה — גדול בהרבה מ-<Tex>{'W_B'}</Tex>.</> },
  { sym: '\\beta', value: <Tex>{'{\\sim}50\\!-\\!500'}</Tex>, label: 'הגבר זרם', accent: 'emerald', why: <>הגבר הזרם <Tex>{'I_C/I_B'}</Tex>: שינוי זעיר ב-<Tex>{'I_B'}</Tex> שולט ב-<Tex>{'I_C'}</Tex> גדול (<Tex>{'\\alpha\\sim0.98\\!-\\!0.998'}</Tex>).</> },
]

export default function TypicalValues() {
  const [sel, setSel] = useState(3) // W_B — the "thin base" headline

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-slate-600">
        <span aria-hidden>📐</span> מספרים אופייניים — טרנזיסטור <span dir="ltr">npn</span> סיליקון <span className="font-normal text-slate-400">(הקישו לפרטים)</span>
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {STATS.map((s, i) => {
          const a = ACCENT[s.accent]
          const on = i === sel
          return (
            <button
              key={i}
              onClick={() => setSel(i)}
              aria-pressed={on}
              className={`flex flex-col items-center gap-0.5 rounded-xl border px-2 py-2.5 text-center transition ${a.card} ${on ? `${a.sel} ring-2 ring-offset-1` : 'opacity-90 hover:opacity-100'}`}
            >
              <span className={`text-base font-bold ${a.text}`} dir="ltr"><Tex>{s.sym}</Tex></span>
              <span className="font-mono text-sm font-semibold text-slate-700" dir="ltr">{s.value}</span>
              <span className="text-[11px] leading-tight text-slate-500">{s.label}</span>
            </button>
          )
        })}
      </div>
      <div className={`rounded-xl border-s-4 p-3 text-sm leading-relaxed text-slate-700 ${ACCENT[STATS[sel].accent].card}`}>
        <span className={`me-1 font-bold ${ACCENT[STATS[sel].accent].text}`} dir="ltr"><Tex>{STATS[sel].sym}</Tex></span>
        {STATS[sel].why}
      </div>
    </div>
  )
}
