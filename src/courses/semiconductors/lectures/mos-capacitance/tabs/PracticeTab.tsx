import type { ReactNode } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'

const QA: { q: ReactNode; a: ReactNode }[] = [
  {
    q: <>בהצטברות, מדוע הקיבול הנמדד שווה ל-<Tex>{'C_{ox}'}</Tex>?</>,
    a: <>בהצטברות נושאי-הרוב מצטברים בשפה ומגיבים מיידית לאות, ולכן <Tex>{'C_s\\to\\infty'}</Tex>. בטור <Tex>{'1/C=1/C_{ox}+1/C_s'}</Tex> האיבר <Tex>{'1/C_s\\to0'}</Tex>, ומתקבל <Tex>{'C\\approx C_{ox}'}</Tex>.</>,
  },
  {
    q: <>במחסור, איך מתנהג הקיבול ככל ש-<Tex>{'V_G'}</Tex> עולה?</>,
    a: <><Tex>{'C=\\left(\\tfrac{1}{C_{ox}}+\\tfrac{W}{\\varepsilon_s}\\right)^{-1}'}</Tex>. ככל ש-<Tex>{'V_G'}</Tex> עולה <Tex>{'W'}</Tex> גדל, <Tex>{'C_{dep}=\\varepsilon_s/W'}</Tex> קטֵן, והקיבול הכולל <b>יורד</b> מונוטונית מתחת ל-<Tex>{'C_{ox}'}</Tex>.</>,
  },
  {
    q: <>מהו ההבדל בין עקומת <Tex>{'C\\text{-}V'}</Tex> בתדר נמוך לתדר גבוה — ולמה?</>,
    a: <>בהיפוך: בתדר נמוך נושאי-המיעוט מספיקים להגיב והקיבול <b>חוזר</b> ל-<Tex>{'C_{ox}'}</Tex>; בתדר גבוה הם לא מספיקים, רק קצה-המחסור נע, והקיבול <b>ננעל</b> על <Tex>{'C_{min}=C_{ox}\\,\\|\\,C_{dep,max}'}</Tex>. הסיבה: זמן-התגובה האיטי של נושאי-המיעוט.</>,
  },
  {
    q: <>מהי "דלדול-עמוק" (deep depletion) ומתי מקבלים אותה?</>,
    a: <>בסריקת-מתח <b>מהירה</b> אין זמן ליצירת ערוץ-ההיפוך, אז <Tex>{'\\psi_s'}</Tex> חורג מ-<Tex>{'2\\phi_F'}</Tex>, <Tex>{'W'}</Tex> עובר את <Tex>{'W_{max}'}</Tex>, והקיבול <b>ממשיך לרדת</b> מתחת ל-<Tex>{'C_{min}'}</Tex>.</>,
  },
  {
    q: <>כיצד מתח אחורי <Tex>{'V_R'}</Tex> (varactor) משנה את אופיין ה-<Tex>{'C\\text{-}V'}</Tex>?</>,
    a: <>הוא מוסיף לכיפוף הדרוש, ולכן <Tex>{'V_T'}</Tex> עולה (העקומה נדחפת ימינה) ו-<Tex>{'W_{max}'}</Tex> גדל (הרצפה <Tex>{'C_{min}'}</Tex> יורדת). כך מקבלים קבל מתכוונן במתח.</>,
  },
]

/** Lesson 6ג — practice on capacitance, C-V and frequency response. */
export default function PracticeTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="שאלות לתרגול">
        <div className="flex flex-col gap-3">
          {QA.map((item, i) => (
            <details key={i} className="rounded-xl border border-slate-200 bg-white p-3">
              <summary className="cursor-pointer font-semibold text-slate-700">{item.q}</summary>
              <p className="mt-2 leading-relaxed text-slate-600" dir="rtl">{item.a}</p>
            </details>
          ))}
        </div>
      </Panel>
    </div>
  )
}
