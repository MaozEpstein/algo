import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'

/** Lesson 7א derivation — from Q_n(y) and drift to the triode/saturation I–V laws. */
export default function DerivationTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="הגזירה — צעד אחר צעד">
        <ol className="flex flex-col gap-4">
          <li className="rounded-xl border border-slate-200 bg-slate-50 p-4 leading-relaxed text-slate-700">
            <b className="text-slate-800">1 · מטען הערוץ המקומי.</b> מעודף-המתח המקומי:
            <div className="my-2 rounded-lg bg-white p-2 text-center"><Tex block>{'Q_n(y)=-C_{ox}\\big[V_{GS}-V_T-V(y)\\big]'}</Tex></div>
          </li>
          <li className="rounded-xl border border-slate-200 bg-slate-50 p-4 leading-relaxed text-slate-700">
            <b className="text-slate-800">2 · הזרם כסחיפה.</b> הזרם קבוע לאורך הערוץ ושווה למטען כפול מהירות-הסחיפה כפול הרוחב, עם
            {' '}<Tex>{'\\xi=-dV/dy'}</Tex>:
            <div className="my-2 rounded-lg bg-white p-2 text-center"><Tex block>{'I_{DS}=W\\,|Q_n(y)|\\,\\mu^*\\,\\xi=W\\mu^*C_{ox}\\big[V_{GS}-V_T-V(y)\\big]\\dfrac{dV}{dy}'}</Tex></div>
          </li>
          <li className="rounded-xl border border-slate-200 bg-slate-50 p-4 leading-relaxed text-slate-700">
            <b className="text-slate-800">3 · אינטגרציה לאורך הערוץ.</b> אוספים <Tex>{'\\int_0^L I_{DS}\\,dy=\\int_0^{V_{DS}}(\\dots)\\,dV'}</Tex> (הזרם קבוע):
            <div className="my-2 rounded-lg border-2 border-sky-300 bg-white p-3 text-center">
              <Tex block>{'I_{DS}=\\dfrac{W}{L}\\mu^*C_{ox}\\left[(V_{GS}-V_T)V_{DS}-\\dfrac{V_{DS}^2}{2}\\right]'}</Tex>
            </div>
            <p className="text-sm text-slate-600">נגדיר את מקדם ההולכה <Tex>{'k=\\dfrac{W}{L}\\mu^*C_{ox}'}</Tex>.</p>
          </li>
        </ol>
      </Panel>

      <Panel title="שני המשטרים — טריודה ורוויה">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border-s-4 border-amber-400 bg-amber-50/60 p-4 leading-relaxed">
            <b className="text-amber-800">טריודה · <Tex>{'V_{DS}<V_{GS}-V_T'}</Tex></b>
            <div className="my-2 rounded-lg bg-white p-2 text-center"><Tex block>{'I_{DS}=k\\left[(V_{GS}-V_T)V_{DS}-\\dfrac{V_{DS}^2}{2}\\right]'}</Tex></div>
            <p className="text-sm text-slate-600">למתחים קטנים <Tex>{'\\approx k(V_{GS}-V_T)V_{DS}'}</Tex> — <b>נגד נשלט-מתח</b>.</p>
          </div>
          <div className="rounded-2xl border-s-4 border-emerald-500 bg-emerald-50/60 p-4 leading-relaxed">
            <b className="text-emerald-800">רוויה · <Tex>{'V_{DS}\\ge V_{GS}-V_T'}</Tex></b>
            <div className="my-2 rounded-lg bg-white p-2 text-center"><Tex block>{'I_{DS}=\\dfrac{k}{2}(V_{GS}-V_T)^2'}</Tex></div>
            <p className="text-sm text-slate-600">מציבים <Tex>{'V_{DS}=V_{DS,sat}=V_{GS}-V_T'}</Tex> — <b>חוק ריבועי</b>, בלתי-תלוי ב-<Tex>{'V_{DS}'}</Tex>.</p>
          </div>
        </div>
        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
          שימו לב לרציפות: בברך <Tex>{'V_{DS}=V_{GS}-V_T'}</Tex> ענף-הטריודה שווה בדיוק ל-<Tex>{'\\tfrac{k}{2}(V_{GS}-V_T)^2'}</Tex> —
          שני הענפים <b>נפגשים חלק</b>.
        </p>
      </Panel>
    </div>
  )
}
