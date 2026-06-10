import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import TransferCurve from '../components/TransferCurve'
import GainExplorerJfet from '../components/GainExplorerJfet'

/** JFET — transfer characteristic (square law) and small-signal g_m / common-source gain. */
export default function TransferTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title={<>אופיין-העברה — <Tex>{'I_D(V_{GS})'}</Tex></>}>
        <p className="leading-relaxed text-slate-700">
          ב<b>רוויה</b> זרם-הניקוז נקבע כולו ע״י מתח-השער, לפי <b>חוק ריבועי</b> (Shockley):
        </p>
        <div className="my-3 rounded-xl bg-slate-50 p-4 text-center">
          <Tex block>{'I_D=I_{DSS}\\left(1-\\dfrac{V_{GS}}{V_P}\\right)^2'}</Tex>
        </div>
        <ul className="list-inside list-disc space-y-1.5 leading-relaxed text-slate-600">
          <li><Tex>{'I_{DSS}'}</Tex> — זרם-הניקוז המרבי, ב-<Tex>{'V_{GS}=0'}</Tex> (התעלה פתוחה לגמרי).</li>
          <li><Tex>{'V_P'}</Tex> — מתח-הצביטה: ב-<Tex>{'V_{GS}=V_P'}</Tex> הזרם מתאפס (קטעון).</li>
        </ul>
        <p className="mt-3 leading-relaxed text-slate-700">
          ה<b>שיפוע</b> של אופיין-ההעברה בנקודת-העבודה הוא מוליכות-המעבר <Tex>{'g_m=\\partial I_D/\\partial V_{GS}'}</Tex>:
        </p>
        <div className="mt-3">
          <TransferCurve />
        </div>
      </Panel>

      <Panel title="אות-קטן: g_m והגבר מקור-משותף">
        <div className="rounded-xl bg-slate-50 p-4 text-center">
          <Tex block>{'g_m=\\frac{\\partial I_D}{\\partial V_{GS}}=\\frac{2I_{DSS}}{|V_P|}\\left(1-\\frac{V_{GS}}{V_P}\\right)=\\frac{2\\sqrt{I_{DSS}\\,I_D}}{|V_P|}'}</Tex>
        </div>
        <p className="mb-3 mt-2 leading-relaxed text-slate-700">
          מקור-הזרם הנשלט במודל הוא <Tex>{'i_d=g_m v_{gs}'}</Tex>. בתצורת <b>מקור-משותף</b> מקור-הזרם זורם דרך
          העומס <Tex>{'(r_o\\parallel R_D)'}</Tex> ויוצר הגבר-מתח <Tex>{'A_v=-g_m(r_o\\parallel R_D)'}</Tex> (מהפך,
          בדיוק כמו ה-CE ב-BJT). גררו את נקודת-העבודה ואת העומס:
        </p>
        <GainExplorerJfet />
      </Panel>
    </div>
  )
}
