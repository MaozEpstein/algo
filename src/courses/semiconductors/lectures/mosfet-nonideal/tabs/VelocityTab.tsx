import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import VelocitySatChart from '../components/VelocitySatChart'

/** Lesson 7ב — velocity saturation: the square law becomes linear at high field. */
export default function VelocityTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="רוויית מהירות (Velocity Saturation)">
        <p className="leading-relaxed text-slate-700">
          המודל האידיאלי מניח <Tex>{'v_{drift}=\\mu\\xi'}</Tex> — מהירות יחסית לשדה, ללא גבול. אבל בשדות גבוהים
          (<Tex>{'\\xi\\gtrsim10^4'}</Tex> V/cm, שכיח בתעלות קצרות) המהירות <b>נרווית</b> ל-<Tex>{'v_{sat}\\approx10^7'}</Tex> cm/s.
          כותבים את זרם-הרוויה כמכפלת מטען-ההיפוך במהירות:
        </p>
        <div className="my-3 rounded-xl border-2 border-rose-300 bg-white p-3 text-center">
          <Tex block>{'I_{DS,sat}=\\underbrace{W\\,C_{ox}(V_{GS}-V_T)}_{Q_{inv}}\\cdot\\underbrace{v_{sat}}_{v_{drift}}'}</Tex>
        </div>
        <p className="text-sm text-slate-600">
          כעת הזרם <b>לינארי</b> ב-<Tex>{'(V_{GS}-V_T)'}</Tex> — לא ריבועי! גם <Tex>{'V_{DS,sat}'}</Tex> קטן מהצפוי.
        </p>
      </Panel>

      <Panel title="שתי מוסכמות לאותה נוסחה">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border-s-4 border-slate-400 bg-slate-50 p-4 text-center">
            <span className="text-xs font-semibold text-slate-500">מוסכמת הסיכום (כיתה)</span>
            <div className="my-2"><Tex block>{'I_{DS,sat}=\\dfrac{W}{2}C_{ox}(V_{GS}-V_T)\\,v_{sat}'}</Tex></div>
          </div>
          <div className="rounded-2xl border-s-4 border-sky-400 bg-sky-50/60 p-4 text-center">
            <span className="text-xs font-semibold text-slate-500">מוסכמת Neamen (מש׳ 11.17)</span>
            <div className="my-2"><Tex block>{'I_{DS,sat}=W\\,C_{ox}(V_{GS}-V_T)\\,v_{sat}'}</Tex></div>
          </div>
        </div>
        <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm leading-relaxed text-amber-800">
          שתי הצורות נכונות — ההבדל הוא <b>פקטור 2</b> בבחירת המהירות: <b>ממוצעת לאורך הערוץ</b> (עם <Tex>{'\\tfrac{1}{2}'}</Tex>)
          מול <b>מהירות-הרוויה המרבית</b>. מה שחשוב פיזיקלית: <b>התלות לינארית</b> ב-<Tex>{'(V_{GS}-V_T)'}</Tex>.
        </p>
      </Panel>

      <Panel title="ראו בעיניים — מ-ריבועי ללינארי">
        <VelocitySatChart />
      </Panel>
    </div>
  )
}
