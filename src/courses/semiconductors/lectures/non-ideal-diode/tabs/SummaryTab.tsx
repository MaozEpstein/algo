import type { ReactNode } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'

const FORMULAS: { he: string; tex: string }[] = [
  { he: 'אופיין כללי', tex: 'J=J_S\\left(e^{V_A/nV_T}-1\\right)' },
  { he: 'זרם רקומבינציה (n=2)', tex: 'J_{rec}=\\tfrac{qn_iW}{2\\tau_0}\\left(e^{V_A/2V_T}-1\\right)' },
  { he: 'הזרם הכולל', tex: 'J=J_{diff}+J_{rec}' },
  { he: 'מתח-הדק עם R_S', tex: 'V_{term}=V_j+J\\,R_S' },
  { he: 'זרם גנרציה אחורי', tex: 'J_{gen}\\approx-\\tfrac{qn_iW}{2\\tau_0}' },
  { he: 'הזרקה חזקה', tex: '\\Delta n\\to N\\;\\Rightarrow\\; n\\to 2' },
]

const MISTAKES: { wrong: ReactNode; right: ReactNode }[] = [
  {
    wrong: <>מקדם אי-האידיאליות <Tex>{'n'}</Tex> הוא קבוע של הדיודה.</>,
    right: <><Tex>{'n'}</Tex> <b>נמדד מקומית</b> ומשתנה לאורך האופיין: ≈2 בקדמי נמוך (רקומבינציה), ≈1 באמצע (דיפוזיה), ושוב ≈2 בקדמי גבוה.</>,
  },
  {
    wrong: <>זרם הרקומבינציה גדל כמו זרם הדיפוזיה (<Tex>{'e^{V_A/V_T}'}</Tex>).</>,
    right: <>הוא גדל כ-<Tex>{'e^{V_A/2V_T}'}</Tex> — <b>חצי השיפוע</b> בלוג, כי תלוי ב-<Tex>{'n_i'}</Tex> ולא ב-<Tex>{'n_i^2'}</Tex>.</>,
  },
  {
    wrong: <>הזרם האחורי רווי בדיוק ב-<Tex>{'-J_S'}</Tex>, כמו באידיאלי.</>,
    right: <>זרם הגנרציה <Tex>{'\\propto W\\propto\\sqrt{V_{bi}+|V_A|}'}</Tex> <b>גדל</b> עם המתח האחורי — לא שטוח.</>,
  },
  {
    wrong: <>התנגדות טורית משנה את הזרם בכל המתחים.</>,
    right: <>רק בזרם <b>גבוה</b>: שם <Tex>{'JR_S'}</Tex> נעשה משמעותי, מכופף את הברך. בזרם נמוך היא זניחה.</>,
  },
  {
    wrong: <>רקומבינציה והזרקה-חזקה הן אותו דבר (שתיהן <Tex>{'n=2'}</Tex>).</>,
    right: <>אותה חתימה, מנגנון <b>שונה</b>: רקומבינציה במלכודות (קדמי נמוך) מול שבירת ההזרקה-החלשה (קדמי גבוה).</>,
  },
]

export default function SummaryTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="הרעיון בקצרה">
        <p className="leading-relaxed text-slate-600">
          הדיודה הממשית = האידיאלית <b>פלוס</b> סטיות: <b>רקומבינציה</b> במלכודות (<Tex>{'n=2'}</Tex>) שולטת בקדמי
          נמוך, <b>דיפוזיה</b> (<Tex>{'n=1'}</Tex>) באמצע, <b>הזרקה חזקה</b> (<Tex>{'n=2'}</Tex>) בקדמי גבוה, ו<b>התנגדות
          טורית</b> מכופפת את הברך בזרם גבוה. בצד האחורי הזרם <b>אינו רווי</b>. הכול נאסף למקדם:
        </p>
        <div className="mt-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-center">
          <Tex block>{'J=J_S\\left(e^{V_A/nV_T}-1\\right),\\qquad 1\\le n\\le 2'}</Tex>
        </div>
        <p className="mt-2 leading-relaxed text-slate-600">
          ה-<Tex>{'n'}</Tex> אינו חוגה — הוא <b>נגזר</b> מהשיפוע המקומי של שתי המעריכיות ומברך ה-<Tex>{'R_S'}</Tex>.
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
          סיימנו את הדיודה מבוססת צומת <b>p-n</b> — אידיאלית ולא-אידיאלית. בחלק הבא נפגוש דיודה מסוג <b>אחר</b>:{' '}
          <b>דיודת שוטקי</b> — צומת <b>מתכת-מוליך-למחצה</b> מיישר, שבו המחסום (<b>מחסום שוטקי</b>) נקבע מהפרש פונקציות
          העבודה, והזרם נישא ב<b>נשאי רוב</b> — ולכן היא מהירה במיוחד.
          <span className="text-slate-400"> (בקרוב)</span>
        </p>
      </Panel>
    </div>
  )
}
