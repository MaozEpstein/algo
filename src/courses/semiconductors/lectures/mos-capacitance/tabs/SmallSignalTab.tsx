import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import MosSmallSignalCircuit from '../components/MosSmallSignalCircuit'

/** Lesson 6ג — the small-signal equivalent circuit of the MOS capacitor. */
export default function SmallSignalTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="הסכמה הקיבולית (מעגל שקול לאות-קטן)">
        <p className="leading-relaxed text-slate-700">
          מנקודת-מבט האות-הקטן, הקבל הוא <b>מעגל קיבולי</b>: קיבול-האוקסיד <Tex>{'C_{ox}'}</Tex> ב<b>טור</b> עם הקיבול
          של המל"מ, שבו <Tex>{'C_s'}</Tex> (תגובת המטען) ו-<Tex>{'C_{ss}'}</Tex> (תגובת מצבי-השטח) יושבים <b>במקביל</b>.
        </p>
        <div className="mt-3 grid items-center gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <MosSmallSignalCircuit />
          </div>
          <div className="flex flex-col gap-3">
            <div className="rounded-xl border-2 border-violet-300 bg-violet-50/60 p-4 text-center">
              <Tex block>{'\\dfrac{1}{C} = \\dfrac{1}{C_{ox}} + \\dfrac{1}{C_s + C_{ss}}'}</Tex>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 text-center text-sm">
              <Tex block>{'C_s = -\\dfrac{dQ_s}{d\\psi_s}, \\quad C_{ss} = -\\dfrac{dQ_{ss}}{d\\psi_s}'}</Tex>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              הקיבול הכולל <b>נשלט ע"י החוליה הקטנה בטור</b>: כש-<Tex>{'C_s'}</Tex> גדול (הצטברות/היפוך) <Tex>{'C\\to C_{ox}'}</Tex>;
              כש-<Tex>{'C_s'}</Tex> קטן (מחסור) הוא מושך את <Tex>{'C'}</Tex> מטה.
            </p>
          </div>
        </div>
      </Panel>

      <Panel title="גזירת הקיבול מהמשוואות">
        <p className="leading-relaxed text-slate-700">
          ממשוואת השער <Tex>{'V_G=\\phi_{MS}+V_{ox}+\\psi_s'}</Tex> ומשימור-המטען <Tex>{'Q_G=-(Q_s+Q_{ss})'}</Tex>,
          גוזרים לפי <Tex>{'Q_G'}</Tex>:
        </p>
        <div className="my-3 overflow-x-auto rounded-xl bg-slate-50 p-4 text-center">
          <Tex block>{'\\dfrac{1}{C_T}=\\dfrac{dV_G}{dQ_G}=\\dfrac{dV_{ox}}{dQ_G}+\\dfrac{d\\psi_s}{dQ_G}=\\dfrac{1}{C_{ox}}+\\dfrac{1}{C_s+C_{ss}}'}</Tex>
        </div>
        <p className="text-sm leading-relaxed text-slate-600">
          שני האיברים: הנפילה על האוקסיד (<Tex>{'1/C_{ox}'}</Tex>) ועל המל"מ (<Tex>{'1/(C_s+C_{ss})'}</Tex>) — בדיוק שני
          קבלים בטור.
        </p>
      </Panel>
    </div>
  )
}
