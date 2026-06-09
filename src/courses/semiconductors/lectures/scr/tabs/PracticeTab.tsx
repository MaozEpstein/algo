import type { ReactNode } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'

const QA: { q: ReactNode; a: ReactNode }[] = [
  {
    q: <>מהו תנאי ההצתה (latch) של ה-SCR במונחי <Tex>{'\\alpha'}</Tex> ובמונחי <Tex>{'\\beta'}</Tex>?</>,
    a: <><Tex>{'\\alpha_1+\\alpha_2\\ge1'}</Tex>, השקול ל-<Tex>{'\\beta_1\\beta_2\\ge1'}</Tex> (כי <Tex>{'\\beta=\\alpha/(1-\\alpha)'}</Tex>). אז המכנה ב-<Tex>{'I_A'}</Tex> מתאפס והזרם מתפרץ.</>,
  },
  {
    q: <>SCR נמצא במצב הולכה. מסירים את אות-השער. מה קורה?</>,
    a: <>הוא <b>ממשיך להוליך</b> — הנעילה (משוב) אינה תלויה בשער. הוא ייכבה רק כשזרם-האנודה יירד מתחת ל-<Tex>{'I_H'}</Tex>.</>,
  },
  {
    q: <>איזה צומת חוסם את המתח הקדמי במצב כבוי, ומדוע?</>,
    a: <>הצומת האמצעי <Tex>{'J_2'}</Tex> (<Tex>{'N_2\\text{-}P_1'}</Tex>) — במתח קדמי <Tex>{'J_1,J_3'}</Tex> מוטים קדמית ו-<Tex>{'J_2'}</Tex> הפוך, ולכן הוא נושא את כל המתח.</>,
  },
  {
    q: <>כיצד זרם-השער משפיע על מתח-הפריצה <Tex>{'V_{BF}'}</Tex>?</>,
    a: <><Tex>{'V_{BF}'}</Tex> <b>יורד</b> ככל ש-<Tex>{'I_G'}</Tex> גדל — זרם-שער גדול מעלה את ה-<Tex>{'\\alpha'}</Tex>-ים, כך שהתנאי <Tex>{'\\alpha_1+\\alpha_2=1'}</Tex> מושג במתח נמוך יותר. בזרם מספיק ה-NDR נעלם וההצתה כמו דיודה.</>,
  },
  {
    q: <>למה ה-SCR נחשב מתג ולא מגבר?</>,
    a: <>בגלל ה-NDR והמשוב החיובי: אין מצב-עבודה לינארי יציב באמצע — ההתקן קופץ בין שני מצבים (חסום/נעול), בדיוק כמו מתג.</>,
  },
]

/** Lesson 4 — practice Q&A (click to reveal). */
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
