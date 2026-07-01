import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import BodyEffectChart from '../components/BodyEffectChart'

/** Lesson 7ב — the body effect: threshold shift with source-to-body bias. */
export default function BodyTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="אפקט המצע (Body Effect)">
        <p className="leading-relaxed text-slate-700">
          עד כה הנחנו שהמצע (Body) והמקור באותו פוטנציאל (<Tex>{'V_{SB}=0'}</Tex>). כשמפרידים ביניהם ומטים את המצע
          <b> אחורה</b> (<Tex>{'V_{SB}>0'}</Tex>), אזור-המחסור מתחת לשער מתרחב ומטען-המחסור גדל — לכן דרוש <b>יותר</b> מתח-שער
          כדי להפוך, ומתח-הסף <b>עולה</b>.
        </p>
        <div className="my-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center text-sm">
            <span className="text-xs font-semibold text-slate-500">מטען-מחסור מרבי</span>
            <div className="mt-1"><Tex block>{'Q_{D,max}\'=\\sqrt{2q\\varepsilon_sN_A(2\\phi_F+V_{SB})}'}</Tex></div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center text-sm">
            <span className="text-xs font-semibold text-slate-500">הסטת הסף</span>
            <div className="mt-1"><Tex block>{'\\Delta V_T=\\dfrac{\\Delta Q_D}{C_{ox}}'}</Tex></div>
          </div>
        </div>
        <div className="rounded-2xl border-2 border-violet-300 bg-white p-3 text-center">
          <Tex block>{'V_T=V_{T0}+\\gamma\\left(\\sqrt{2\\phi_F+V_{SB}}-\\sqrt{2\\phi_F}\\right),\\quad \\gamma=\\dfrac{\\sqrt{2q\\varepsilon_sN_A}}{C_{ox}}'}</Tex>
        </div>
      </Panel>

      <Panel title="ראו בעיניים — עליית הסף עם V_SB">
        <BodyEffectChart />
      </Panel>
    </div>
  )
}
