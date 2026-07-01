import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import SubthresholdChart from '../components/SubthresholdChart'

/** Lesson 7ב — subthreshold conduction (diffusion) and the subthreshold swing. */
export default function SubthresholdTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="הולכת תת-סף — הזרם לא באמת אפס">
        <p className="leading-relaxed text-slate-700">
          המודל האידיאלי מנבא זרם אפס מתחת ל-<Tex>{'V_T'}</Tex>. בפועל יש <b>ערוץ חלש</b> (היפוך-חלש) והזרם דועך
          <b> אקספוננציאלית</b>. כאן ההולכה היא ב-<b>דיפוזיה</b> (לא סחיפה) — נושאים מטפסים על מחסום, בדיוק כמו ב-BJT:
        </p>
        <div className="my-3 rounded-xl border-2 border-sky-300 bg-white p-3 text-center">
          <Tex block>{'I_{D,\\text{sub}}=\\dfrac{qWX_{ch}D_n}{L}\\,e^{\\,q\\psi_s/kT}\\left(1-e^{-qV_{DS}/kT}\\right)'}</Tex>
        </div>
        <p className="text-sm text-slate-600">
          התלות ב-<Tex>{'\\psi_s'}</Tex> (ולכן ב-<Tex>{'V_{GS}'}</Tex>) אקספוננציאלית → קו-ישר על ציר-לוג.
        </p>
      </Panel>

      <Panel title="נדנוד תת-סף (Subthreshold Swing)">
        <div className="rounded-2xl border-s-4 border-sky-500 bg-sky-50/60 p-4 leading-relaxed text-slate-700">
          <p>כמה מתח-שער דרוש כדי לשנות את הזרם בעשור (פקטור 10)? זהו ה-<b>subthreshold swing</b>:</p>
          <div className="my-2 rounded-xl border-2 border-sky-300 bg-white p-3 text-center">
            <Tex block>{'S\\equiv\\left[\\dfrac{d(\\log_{10}I_D)}{dV_{GS}}\\right]^{-1}=2.3\\,\\dfrac{m\\,kT}{q}\\approx m\\cdot60\\ \\text{mV/dec}'}</Tex>
          </div>
          <p>
            כאשר <Tex>{'m=1+C_{dep}/C_{ox}\\ge1'}</Tex>. הגבול האידיאלי בטמפ׳-חדר הוא <b>~60 mV/decade</b> — חסם פיזיקלי מפורסם
            שקובע כמה <b>תלול</b> אפשר לכבות טרנזיסטור, ולכן כמה <b>הספק-דליפה</b> יש במעגל.
          </p>
        </div>
      </Panel>

      <Panel title="ראו בעיניים — ציר לוגריתמי">
        <SubthresholdChart />
      </Panel>
    </div>
  )
}
