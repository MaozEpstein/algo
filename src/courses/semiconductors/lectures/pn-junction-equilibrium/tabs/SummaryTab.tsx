import type { ReactNode } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'

const FORMULAS: { he: string; tex: string }[] = [
  { he: 'מתח בנוי', tex: 'V_{bi} = \\frac{kT}{q}\\ln\\!\\left(\\frac{N_A N_D}{n_i^2}\\right)' },
  { he: 'נייטרליות מטען', tex: 'N_A\\,d_p = N_D\\,d_n' },
  { he: 'רוחב אזור המחסור', tex: 'd = \\sqrt{\\frac{2\\varepsilon_s V_{bi}}{q}\\cdot\\frac{N_A+N_D}{N_A N_D}}' },
  { he: 'שדה מרבי', tex: 'E_{max} = \\frac{2V_{bi}}{d}' },
  { he: 'ריכוז אינטרינסי', tex: 'n_i = \\sqrt{N_c N_v}\\,e^{-E_g/2kT}' },
  { he: 'מרחק דיפוזיה', tex: 'L = \\sqrt{D\\,\\tau}' },
]

const MISTAKES: { wrong: ReactNode; right: ReactNode }[] = [
  {
    wrong: 'בשיווי משקל אין זרמים בצומת.',
    right: 'יש זרמי דיפוזיה וסחיפה גדולים — הם פשוט מתאזנים לזרם נטו אפס.',
  },
  {
    wrong: 'אזור המחסור ריק ממטען.',
    right: 'הוא ריק מנושאים חופשיים, אך מלא במטען של יונים קבועים — וזה מקור השדה הבנוי.',
  },
  {
    wrong: (
      <>
        אפשר למדוד את <Tex>{'V_{bi}'}</Tex> עם מודד-מתח על ההתקן.
      </>
    ),
    right: 'לא — המתח הבנוי מתקזז במגעים בקצוות; אי אפשר לחלץ ממנו הספק.',
  },
  {
    wrong: 'הצד המסומם יותר מקבל אזור מחסור רחב יותר.',
    right: 'הפוך: אזור המחסור רחב יותר בצד המסומם פחות (מנייטרליות המטען).',
  },
  {
    wrong: 'גנרציה ורקומבינציה מתרחשות רק כשמפעילים מתח או אור.',
    right: (
      <>
        הן קורות תמיד; בשיווי משקל הן פשוט מתאזנות (<Tex>{'G = R'}</Tex>) — ומכאן <Tex>{'n\\cdot p = n_i^2'}</Tex>.
      </>
    ),
  },
  {
    wrong: (
      <>
        מרחק הדיפוזיה <Tex>{'L'}</Tex> תלוי רק במקדם הדיפוזיה <Tex>{'D'}</Tex>.
      </>
    ),
    right: (
      <>
        גם בזמן החיים <Tex>{'\\tau'}</Tex>: <Tex>{'L=\\sqrt{D\\tau}'}</Tex> — נושא ש"חי" יותר זמן מתפזר רחוק יותר.
      </>
    ),
  },
]

export default function SummaryTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="הרעיון בקצרה">
        <p className="leading-relaxed text-slate-600">
          בצומת PN, דיפוזיה של נושאי-רוב חושפת יונים קבועים ויוצרת <b>אזור מחסור</b> עם <b>שדה בנוי</b>.
          בשיווי משקל הסחיפה מהשדה מאזנת בדיוק את הדיפוזיה — זרם נטו אפס, ו-<Tex>{'E_F'}</Tex> אחידה.
        </p>
        <p className="mt-2 leading-relaxed text-slate-600">
          כל האלקטרוסטטיקה נובעת מאינטגרל כפול: <Tex>{'\\rho \\to E \\to V'}</Tex>.
        </p>
      </Panel>

      <Panel title="נוסחאות מפתח">
        <div className="grid gap-2 sm:grid-cols-2">
          {FORMULAS.map((f) => (
            <div key={f.he} className="flex flex-col items-center gap-1 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <span className="text-xs font-medium text-slate-400">{f.he}</span>
              <Tex block>{f.tex}</Tex>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="טעויות נפוצות">
        <ul className="flex flex-col gap-3">
          {MISTAKES.map((m, i) => (
            <li key={i} className="flex flex-col gap-1">
              <span className="flex items-baseline gap-2 font-medium text-slate-700">
                <span className="text-rose-500" aria-hidden>
                  ✗
                </span>
                <span className="line-through decoration-rose-300">{m.wrong}</span>
              </span>
              <span className="flex items-baseline gap-2 ps-6 leading-relaxed text-slate-600">
                <span className="text-emerald-500" aria-hidden>
                  ✓
                </span>
                <span>{m.right}</span>
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="מה הלאה?">
        <p className="leading-relaxed text-slate-600">
          בנינו את הצומת ב<b>שיווי משקל</b>. ב<b>חלק ב' — הצומת תחת ממתח</b> נראה מה קורה כשמפעילים מתח חיצוני:
          המחסום יורד או עולה, אזור המחסור והקיבול משתנים, ונושאי מיעוט מוזרקים. ב<b>שיעור 2 — דיודת PN</b>
          נהפוך זאת לזרם: האופיין המעריכי <Tex>{'I=I_0(e^{qV/kT}-1)'}</Tex>.
        </p>
      </Panel>
    </div>
  )
}
