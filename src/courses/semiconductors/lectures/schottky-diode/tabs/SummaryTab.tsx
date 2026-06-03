import type { ReactNode } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'

const FORMULAS: { he: string; tex: string }[] = [
  { he: 'גובה המחסום', tex: '\\varphi_B=\\varphi_m-\\chi' },
  { he: 'מתח בנוי', tex: 'V_{bi}=\\varphi_B-\\xi' },
  { he: 'אופיין שוטקי', tex: 'J=J_{ST}\\left(e^{V_A/V_T}-1\\right)' },
  { he: 'זרם רוויה תרמיוני', tex: 'J_{ST}=A^{*}T^2e^{-\\varphi_B/V_T}' },
  { he: 'רוחב מחסור', tex: 'W=\\sqrt{2\\varepsilon_s(V_{bi}-V_A)/(qN_D)}' },
  { he: 'קריטריון מיישר', tex: '\\varphi_m>\\chi+\\xi' },
]

const MISTAKES: { wrong: ReactNode; right: ReactNode }[] = [
  {
    wrong: <>דיודת שוטקי נושאת זרם בנושאי מיעוט, כמו דיודת PN.</>,
    right: <>היא התקן <b>נושאי-רוב</b> (פליטה תרמיונית) — ולכן אין אגירת מיעוט ו<b>אין reverse-recovery</b>.</>,
  },
  {
    wrong: <>גובה המחסום <Tex>{'\\varphi_B'}</Tex> תלוי במתח המופעל.</>,
    right: <>מצד-המתכת <Tex>{'\\varphi_B=\\varphi_m-\\chi'}</Tex> <b>קבוע</b>; רק הכיפוף מצד-המל"מ <Tex>{'q(V_{bi}-V_A)'}</Tex> משתנה — לכן האחורי רווי.</>,
  },
  {
    wrong: <>כל מגע מתכת-מל"מ הוא דיודה מיישרת.</>,
    right: <>רק כש-<Tex>{'\\varphi_m>\\varphi_s'}</Tex> (n). אחרת המגע <b>אוהמי</b> — וגם סימום כבד הופך אותו לאוהמי (מנהור).</>,
  },
  {
    wrong: <>מתח-ההצתה של שוטקי נמוך כי <Tex>{'V_{bi}'}</Tex> שלה קטן.</>,
    right: <>הוא נמוך כי <Tex>{'J_{ST}\\gg J_S'}</Tex> (קדם תרמיוני גדול) — הזרם מגיע לערך נתון במתח נמוך יותר.</>,
  },
  {
    wrong: <>על Si כל מתכת נותנת מחסום אחר לפי <Tex>{'\\varphi_m-\\chi'}</Tex>.</>,
    right: <>במציאות <b>קיבוע רמת-פרמי</b> (Bardeen) הופך את <Tex>{'\\varphi_B'}</Tex> לכמעט בלתי-תלוי במתכת.</>,
  },
]

export default function SummaryTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="הרעיון בקצרה">
        <p className="leading-relaxed text-slate-600">
          מגע מתכת–מל"מ-n עם <Tex>{'\\varphi_m>\\varphi_s'}</Tex> יוצר <b>מחסום שוטקי</b> <Tex>{'\\varphi_B=\\varphi_m-\\chi'}</Tex>.
          הזרם הוא <b>פליטה תרמיונית</b> של נושאי רוב מעל המחסום, ונותן אופיין שוקלי:
        </p>
        <div className="mt-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-center">
          <Tex block>{'J=A^{*}T^2e^{-\\varphi_B/V_T}\\left(e^{V_A/V_T}-1\\right)'}</Tex>
        </div>
        <p className="mt-2 leading-relaxed text-slate-600">
          הקדם התרמיוני גדול בהרבה מ-<Tex>{'J_S'}</Tex> של דיודת PN — מכאן <b>מתח-הצתה נמוך</b> ו<b>דליפה גדולה</b> —
          ובהיותה התקן נושאי-רוב היא <b>מהירה מאוד</b>. האחורי רווי כי <Tex>{'\\varphi_B'}</Tex> מצד-המתכת קבוע.
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
                <span className="text-rose-500" aria-hidden>✗</span>
                <span className="line-through decoration-rose-300">{m.wrong}</span>
              </span>
              <span className="flex items-baseline gap-2 ps-6 leading-relaxed text-slate-600">
                <span className="text-emerald-500" aria-hidden>✓</span>
                <span>{m.right}</span>
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="מה הלאה?">
        <p className="leading-relaxed text-slate-600">
          ראינו את המגע המתכת–מל"מ ה<b>מיישר</b>. בחלק הבא — <b>המגע האוהמי</b> (2ד): מתי המגע <b>אינו</b> מיישר
          (<Tex>{'\\varphi_m<\\varphi_s'}</Tex>, או סימום כבד שמאפשר <b>מנהור</b> דרך מחסור צר), ואיך בונים מגע
          בעל התנגדות נמוכה לחיבור ההתקן למעגל בלי דיודה טפילית.
          <span className="text-slate-400"> (בקרוב)</span>
        </p>
      </Panel>
    </div>
  )
}
