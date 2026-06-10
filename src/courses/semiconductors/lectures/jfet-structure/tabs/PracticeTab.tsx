import type { ReactNode } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'

const QA: { q: ReactNode; a: ReactNode }[] = [
  {
    q: <>מהו מתח-הצביטה <Tex>{'V_P'}</Tex>, וממה הוא מושפע?</>,
    a: <>מתח השער שמדלדל את <b>כל</b> התעלה (<Tex>{'|V_P|=qN_Da^2/2\\varepsilon_s'}</Tex>). גדל עם הסימום <Tex>{'N_D'}</Tex> ועם רוחב חצי-התעלה <Tex>{'a'}</Tex>.</>,
  },
  {
    q: <>למה הזרם <Tex>{'I_D'}</Tex> מגיע לרוויה במקום להמשיך לעלות עם <Tex>{'V_{DS}'}</Tex>?</>,
    a: <>כי בקצה הניקוז התעלה <b>נצבטת</b> (<Tex>{'V_{DS}\\ge V_{Dsat}'}</Tex>); כל תוספת מתח נופלת על אזור-הצביטה הצר, והזרם דרך התעלה כמעט אינו משתנה.</>,
  },
  {
    q: <>מדוע אזור-המחסור רחב יותר בצד הניקוז מאשר בצד המקור?</>,
    a: <>הפוטנציאל בתעלה גבוה יותר בקצה הניקוז, ולכן ההטיה האחורית של צומת שער-תעלה גדולה יותר שם — ואזור-המחסור מתרחב עם ההטיה האחורית.</>,
  },
  {
    q: <>מהו תנאי הקטעון (cutoff)?</>,
    a: <><Tex>{'|V_{GS}|\\ge|V_P|'}</Tex> — השער לבדו מדלדל את כל התעלה לאורכה, ולכן אין נתיב מוליך והזרם אפס.</>,
  },
  {
    q: <>במה שונה ה-JFET מ-BJT מבחינת השליטה?</>,
    a: <>ב-JFET <b>מתח</b>-השער שולט בזרם דרך אזור-מחסור (כניסה כמעט ללא זרם — התנגדות-כניסה עצומה); ב-BJT <b>זרם</b>-הבסיס שולט בזרם-הקולט.</>,
  },
]

/** Lesson 5א — practice Q&A (click to reveal). */
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
