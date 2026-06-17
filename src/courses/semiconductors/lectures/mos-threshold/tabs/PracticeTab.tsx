import type { ReactNode } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'

const QA: { q: ReactNode; a: ReactNode }[] = [
  {
    q: <>חישוב: נתון <Tex>{'V_{FB}=-0.74\\,V'}</Tex>, <Tex>{'2\\phi_F=0.81\\,V'}</Tex>, <Tex>{'Q_{dep,max}/C_{ox}=0.95\\,V'}</Tex>. מהו מתח-הסף <Tex>{'V_T'}</Tex>?</>,
    a: <><Tex>{'V_T=V_{FB}+2\\phi_F+\\dfrac{Q_{dep,max}}{C_{ox}}=-0.74+0.81+0.95\\approx1.02\\,V'}</Tex>.</>,
  },
  {
    q: <>בכל אחד משלושת המשטרים — מה ההתנהגות של <Tex>{'|Q_s|'}</Tex> כפונקציה של <Tex>{'\\psi_s'}</Tex>?</>,
    a: <>הצטברות (<Tex>{'\\psi_s<0'}</Tex>): מעריכי, <Tex>{'\\propto e^{q|\\psi_s|/2kT}'}</Tex>. מחסור (<Tex>{'\\psi_s>0'}</Tex>): <Tex>{'\\sqrt{2q\\varepsilon_sN_A\\psi_s}=Q_{dep}'}</Tex>. היפוך חזק (<Tex>{'\\psi_s>2\\phi_F'}</Tex>): שוב מעריכי, <Tex>{'\\propto e^{q\\psi_s/2kT}'}</Tex> (מהאיבר <Tex>{'n_i^2'}</Tex>).</>,
  },
  {
    q: <>מטען אוקסיד חיובי <Tex>{'N_{ss}>0'}</Tex> — לאן הוא מזיז את <Tex>{'V_{FB}'}</Tex> ואת <Tex>{'V_T'}</Tex>?</>,
    a: <><b>שלילה</b>: <Tex>{'V_{FB}=\\phi_{MS}-Q_{ss}/C_{ox}'}</Tex>, ומאחר ש-<Tex>{'V_T=V_{FB}+2\\phi_F+|Q_{D,\\max}|/C_{ox}'}</Tex>, גם <Tex>{'V_T'}</Tex> זז באותו <Tex>{'\\Delta V_{FB}'}</Tex>. כל האופיין נדחף שמאלה.</>,
  },
  {
    q: <>מדוע מטען-תחמוצת קרוב ל<b>שער</b> משפיע פחות ממטען צמוד ל<b>ממשק</b>?</>,
    a: <>השפעת המטען על <Tex>{'V_{FB}'}</Tex> משוקללת לפי המרחק מהשער: <Tex>{'Q_{ss}=\\int_0^{t_{ox}}\\tfrac{x}{t_{ox}}\\rho_{ox}(x)\\,dx'}</Tex>. מטען ב-<Tex>{'x=0'}</Tex> (צמוד לשער) תורם 0; מטען בממשק (<Tex>{'x=t_{ox}'}</Tex>) תורם במלואו.</>,
  },
  {
    q: <>למה <Tex>{'V_T'}</Tex> תלוי בעובי האוקסיד <Tex>{'t_{ox}'}</Tex>?</>,
    a: <>דרך <Tex>{'C_{ox}=\\varepsilon_{ox}\\varepsilon_0/t_{ox}'}</Tex>: אוקסיד עבה → <Tex>{'C_{ox}'}</Tex> קטן → האיבר <Tex>{'|Q_{D,\\max}|/C_{ox}'}</Tex> גדל → <Tex>{'V_T'}</Tex> עולה (וגם הזזת <Tex>{'Q_{ss}/C_{ox}'}</Tex> גדלה).</>,
  },
]

/** Lesson 6ב — practice on Q_s, V_T and oxide charges. */
export default function PracticeTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="שאלות לתרגול (כולל חישוביות)">
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
