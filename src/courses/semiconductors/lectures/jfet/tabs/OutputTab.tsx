import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import OutputCharacteristicsJfet from '../components/OutputCharacteristicsJfet'

/** JFET — output characteristics I_D(V_DS): ohmic (VCR) → saturation. */
export default function OutputTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title={<>אופייני-מוצא — <Tex>{'I_D(V_{DS})'}</Tex></>}>
        <p className="leading-relaxed text-slate-700">
          לכל <Tex>{'V_{GS}'}</Tex> עקומה של זרם-הניקוז מול מתח-הניקוז. קרוב לראשית התעלה פתוחה לכל אורכה והעקומה
          <b> לינארית</b> — ההתקן הוא <b>נגד נשלט-מתח</b> (VCR). כשמתקרבים ל-<Tex>{'V_{Dsat}'}</Tex> התעלה נצבטת בקצה
          הניקוז, והזרם <b>רווי</b>.
        </p>
        <div className="mt-3">
          <OutputCharacteristicsJfet />
        </div>
      </Panel>

      <Panel title="שני האזורים — נוסחאות">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-s-4 border-sky-300 bg-sky-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-sky-700">אזור אוהמי</b> (<Tex>{'V_{DS}<V_{Dsat}'}</Tex>):
            <div className="mt-1 text-center"><Tex>{'I_D=I_{DSS}\\left[2\\left(1-\\tfrac{V_{GS}}{V_P}\\right)\\tfrac{V_{DS}}{|V_P|}-\\left(\\tfrac{V_{DS}}{|V_P|}\\right)^2\\right]'}</Tex></div>
            למתחי-ניקוז קטנים <Tex>{'\\Rightarrow I_D\\propto V_{DS}'}</Tex> (נגד).
          </div>
          <div className="rounded-xl border-s-4 border-emerald-300 bg-emerald-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-emerald-700">אזור רוויה</b> (<Tex>{'V_{DS}\\ge V_{Dsat}'}</Tex>):
            <div className="mt-1 text-center"><Tex>{'I_D=I_{DSS}\\left(1-\\dfrac{V_{GS}}{V_P}\\right)^2'}</Tex></div>
            הזרם תלוי רק ב-<Tex>{'V_{GS}'}</Tex> — מקור-זרם נשלט.
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          שתי הצורות נפגשות ברציפות ב-<Tex>{'V_{DS}=V_{Dsat}=|V_P|-|V_{GS}|'}</Tex> — שם שתיהן שוות ל-<Tex>{'I_{DSS}(1-V_{GS}/V_P)^2'}</Tex>.
        </p>
      </Panel>
    </div>
  )
}
