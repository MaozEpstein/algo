import type { ReactNode } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'

const QA: { q: ReactNode; a: ReactNode }[] = [
  {
    q: <>חישוב: מהו פוטנציאל-פרמי <Tex>{'\\phi_F'}</Tex> במצע Si מסוג p עם <Tex>{'N_A=10^{17}\\,cm^{-3}'}</Tex> (300K)?</>,
    a: <><Tex>{'\\phi_F=\\dfrac{kT}{q}\\ln\\dfrac{N_A}{n_i}=0.0259\\cdot\\ln\\dfrac{10^{17}}{1.5\\times10^{10}}\\approx0.0259\\cdot15.7\\approx0.41\\,V'}</Tex>.</>,
  },
  {
    q: <>חישוב: מהו קיבול-האוקסיד ליחידת-שטח <Tex>{'C_{ox}'}</Tex> עבור <Tex>{'t_{ox}=20\\,nm'}</Tex> (SiO₂, <Tex>{'\\varepsilon_r=3.9'}</Tex>)?</>,
    a: <><Tex>{'C_{ox}=\\dfrac{\\varepsilon_{ox}\\varepsilon_0}{t_{ox}}=\\dfrac{3.9\\cdot8.85\\times10^{-14}}{20\\times10^{-7}}\\approx1.73\\times10^{-7}\\,F/cm^2\\;(\\approx173\\,nF/cm^2)'}</Tex>.</>,
  },
  {
    q: <>חישוב: מהו רוחב-המחסור המרבי <Tex>{'W_{max}'}</Tex> בהיפוך (<Tex>{'\\psi_s=2\\phi_F=0.81\\,V'}</Tex>, <Tex>{'N_A=10^{17}'}</Tex>)?</>,
    a: <><Tex>{'W_{max}=\\sqrt{\\dfrac{2\\varepsilon_s\\,(2\\phi_F)}{qN_A}}=\\sqrt{\\dfrac{2\\cdot11.8\\cdot8.85\\times10^{-14}\\cdot0.81}{1.6\\times10^{-19}\\cdot10^{17}}}\\approx1.0\\times10^{-5}\\,cm=100\\,nm'}</Tex>.</>,
  },
  {
    q: <>חישוב: נתון <Tex>{'V_{FB}=-0.74\\,V'}</Tex>, <Tex>{'2\\phi_F=0.81\\,V'}</Tex>, <Tex>{'Q_{dep,max}/C_{ox}=0.95\\,V'}</Tex>. מהו מתח-הסף <Tex>{'V_T'}</Tex>?</>,
    a: <><Tex>{'V_T=V_{FB}+2\\phi_F+\\dfrac{Q_{dep,max}}{C_{ox}}=-0.74+0.81+0.95\\approx1.02\\,V'}</Tex>.</>,
  },
  {
    q: <>נתון <Tex>{'V_{FB}=-0.74\\,V'}</Tex> ו-<Tex>{'V_T=1.02\\,V'}</Tex>. באיזה משטר נמצא הקבל ב-<Tex>{'V_G=0'}</Tex>?</>,
    a: <>מאחר ש-<Tex>{'V_{FB}<0<V_T'}</Tex> → <b>מחסור</b>. (מתחת ל-<Tex>{'V_{FB}'}</Tex> הצטברות; מעל <Tex>{'V_T'}</Tex> היפוך.)</>,
  },
  {
    q: <>מדוע אומרים שקבל-MOS "לא מושך זרם DC" דרך השער?</>,
    a: <>האוקסיד (SiO₂) הוא <b>מבודד</b> מצוין — אין מסלול הולכה דרכו. השער פועל דרך <b>השדה</b> (קיבולי) בלבד, ולכן הכניסה כמעט ללא זרם — בדיוק כמו לוח של קבל.</>,
  },
  {
    q: <>בהיפוך, מדוע רוחב-המחסור מפסיק לגדול (<Tex>{'W=W_{max}'}</Tex>)?</>,
    a: <>ברגע שנוצר ערוץ-ההיפוך, כל תוספת מטען-שער מאוזנת ע״י <b>אלקטרוני-ההיפוך</b> (לא ע״י הרחבת המחסור). לכן <Tex>{'\\psi_s'}</Tex> ננעל על <Tex>{'2\\phi_F'}</Tex> ו-<Tex>{'W'}</Tex> נשאר מרבי.</>,
  },
]

/** Lesson 6א — practice with computational + conceptual questions (click to reveal). */
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
