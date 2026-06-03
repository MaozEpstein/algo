import type { ReactNode } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'

const FORMULAS: { he: string; tex: string }[] = [
  { he: 'אופיין שוקלי', tex: 'J=J_S\\left(e^{V_A/V_T}-1\\right)' },
  { he: 'זרם הרוויה', tex: 'J_S=qn_i^2\\!\\left(\\tfrac{D_p}{L_pN_D}+\\tfrac{D_n}{L_nN_A}\\right)' },
  { he: 'יחס איינשטיין', tex: 'D=\\tfrac{kT}{q}\\,\\mu' },
  { he: 'אורך דיפוזיה', tex: 'L=\\sqrt{D\\tau}' },
  { he: 'פרופיל המיעוט', tex: '\\Delta p_n(x)=\\Delta p_n(0)e^{-x/L_p}' },
  { he: 'זרם דיפוזיה בקצה', tex: 'J_p=qD_p\\,\\Delta p_n(0)/L_p' },
]

const MISTAKES: { wrong: ReactNode; right: ReactNode }[] = [
  {
    wrong: <>הזרם נובע מסחיפה בשדה של אזור המחסור.</>,
    right: <>בדיודה האידיאלית הזרם הוא <b>דיפוזיה</b> של נושאי מיעוט מוזרקים באזורים <b>הניטרליים</b>.</>,
  },
  {
    wrong: <>זרם הרוויה קבוע ואינו תלוי בטמפרטורה.</>,
    right: <><Tex>{'J_S\\propto n_i^2'}</Tex> — תלוי <b>חזק</b> בטמפרטורה ובפער האסור; חימום מכפיל אותו במהירות.</>,
  },
  {
    wrong: <>הצד המסומם <b>יותר</b> שולט בזרם.</>,
    right: <>להפך: כל תרומה <Tex>{'\\propto 1/N'}</Tex>, ולכן הצד <b>המסומם-פחות</b> שולט בהזרקה.</>,
  },
  {
    wrong: <>בממתח אחורי הזרם הוא בדיוק אפס.</>,
    right: <>הוא <Tex>{'\\approx -J_S'}</Tex> — זעיר, אך לא אפס, ו<b>רווי</b> (כמעט בלתי תלוי במתח).</>,
  },
  {
    wrong: <>אורך הדיפוזיה <Tex>{'L'}</Tex> הוא רוחב אזור המחסור.</>,
    right: <><Tex>{'L=\\sqrt{D\\tau}'}</Tex> הוא מרחק הדיפוזיה <b>באזור הניטרלי</b> — שונה לגמרי מרוחב המחסור <Tex>{'d'}</Tex>.</>,
  },
]

export default function SummaryTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="הרעיון בקצרה">
        <p className="leading-relaxed text-slate-600">
          ממתח קדמי מזריק נושאי מיעוט (חוק הצומת), הם <b>מתפזרים</b> אל האזור הניטרלי ו<b>נעלמים ברקומבינציה</b> על
          סקאלת <Tex>{'L=\\sqrt{D\\tau}'}</Tex>. השיפוע של הפרופיל בקצה הוא <b>זרם הדיפוזיה</b> — וסכום תרומות
          החורים והאלקטרונים נותן את אופיין שוקלי:
        </p>
        <div className="mt-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-center">
          <Tex block>{'J=J_S\\left(e^{V_A/V_T}-1\\right)'}</Tex>
        </div>
        <p className="mt-2 leading-relaxed text-slate-600">
          מעריכי וגדל בקדמי, רווי (<Tex>{'-J_S'}</Tex>) באחורי, אפס בשיווי-משקל — וזו פעולת ה<b>שסתום</b> של
          הדיודה.
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
          בכך השלמנו את <b>הדיודה האידיאלית</b>. בחלק הבא נשחרר את ההנחות ונפגוש את <b>הדיודה הלא-אידיאלית</b>:
          זרם <b>רקומבינציה</b> באזור המחסור (מקדם אי-אידיאליות <Tex>{'n'}</Tex> בין 1 ל-2), <b>הזרקה חזקה</b>,
          והתנגדות טורית — כל הסטיות מהקו המעריכי הנקי.
          <span className="text-slate-400"> (בקרוב)</span>
        </p>
      </Panel>
    </div>
  )
}
