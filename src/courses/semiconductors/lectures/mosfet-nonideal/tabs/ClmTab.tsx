import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import OutputCharChart from '../../mosfet/components/OutputCharChart'

/** Lesson 7ב — channel-length modulation (short-channel effect): finite output slope, λ, r_o. */
export default function ClmTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="הרעיון — הערוץ מתקצר">
        <p className="leading-relaxed text-slate-700">
          ברוויה, אזור-המחסור בקצה-הניקוז <b>מתרחב אל תוך הערוץ</b> ומקצר את אורכו האפקטיבי <Tex>{'L_{eff}=L-\\Delta L'}</Tex>.
          כיוון ש-<Tex>{'\\Delta L'}</Tex> גדל עם <Tex>{'V_{DS}'}</Tex>, הזרם (יחסי ל-<Tex>{'1/L'}</Tex>) <b>עולה מעט</b> ברוויה —
          המישור כבר לא שטוח.
        </p>
        <div className="my-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center text-sm">
            <span className="text-xs font-semibold text-slate-500">הרחבת המחסור בניקוז</span>
            <div className="mt-1"><Tex block>{'\\Delta L\\propto\\sqrt{\\phi_{bi}+V_{DS}}'}</Tex></div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center text-sm">
            <span className="text-xs font-semibold text-slate-500">הזרם האמיתי</span>
            <div className="mt-1"><Tex block>{'I_D\\,\'=\\dfrac{L}{L-\\Delta L}\\,I_D'}</Tex></div>
          </div>
        </div>
      </Panel>

      <Panel title="הצורה ההנדסית — פרמטר λ">
        <div className="rounded-2xl border-s-4 border-amber-500 bg-amber-50/60 p-4 leading-relaxed text-slate-700">
          <p>הקירוב השימושי (Neamen מש׳ 11.12) מוסיף שיפוע ליניארי לרוויה:</p>
          <div className="my-3 rounded-xl border-2 border-amber-300 bg-white p-3 text-center">
            <Tex block>{'I_{DS}=\\dfrac{k}{2}(V_{GS}-V_T)^2\\,(1+\\lambda V_{DS})'}</Tex>
          </div>
          <p>
            <Tex>{'\\lambda'}</Tex> הוא <b>מקדם התקצרות-התעלה</b> (יחידות <Tex>{'V^{-1}'}</Tex>). כעת מוליכות-המוצא אינה אפס,
            ו<b>התנגדות-המוצא סופית</b>:
          </p>
          <div className="my-2 text-center"><Tex block>{'r_o=\\left(\\dfrac{\\partial I_{DS}}{\\partial V_{DS}}\\right)^{-1}\\approx\\dfrac{1}{\\lambda I_D}'}</Tex></div>
          <p className="text-sm text-slate-600">ככל שההתקן קטן יותר, <Tex>{'\\Delta L/L'}</Tex> גדֵל, האפקט <b>חמור יותר</b>, ו-<Tex>{'r_o'}</Tex> קטֵן.</p>
        </div>
      </Panel>

      <Panel title="ראו בעיניים — מישור-רוויה משופע">
        <p className="mb-2 text-sm leading-relaxed text-slate-600">
          אותה משפחת אופייני-מוצא כמו בחלק א׳, אך כעת עם <Tex>{'\\lambda>0'}</Tex>: שימו לב לשיפוע החיובי ברוויה
          ולקריאת <Tex>{'r_o'}</Tex>.
        </p>
        <OutputCharChart lambda={0.06} />
      </Panel>
    </div>
  )
}
