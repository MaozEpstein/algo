import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import LatchExplorer from '../components/LatchExplorer'

/** Lesson 4 — the latch condition α1+α2 ≥ 1 and the regenerative current. */
export default function LatchTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="תנאי ההצתה — מתי ננעל?">
        <p className="leading-relaxed text-slate-700">
          נסמן ב-<Tex>{'\\alpha_1,\\alpha_2'}</Tex> את הגברי-הזרם (בבסיס משותף) של שני הטרנזיסטורים. חיבור ה-KCL של
          המודל נותן את זרם-האנודה:
        </p>
        <div className="my-3 rounded-xl bg-slate-50 p-4 text-center">
          <Tex block>{'I_A = \\dfrac{\\alpha_2 I_G + I_{leak}}{1-(\\alpha_1+\\alpha_2)}'}</Tex>
        </div>
        <p className="leading-relaxed text-slate-700">
          כאשר <Tex>{'\\alpha_1+\\alpha_2\\to1'}</Tex> המכנה מתאפס ו-<Tex>{'I_A'}</Tex> מתפרץ — זהו ה-<b>latch</b>.
          מאחר ש-<Tex>{'\\beta=\\alpha/(1-\\alpha)'}</Tex>, התנאי שקול ל-<Tex>{'\\beta_1\\beta_2\\ge1'}</Tex>.
        </p>
        <div className="mt-2 rounded-xl border-s-4 border-emerald-300 bg-emerald-50/50 p-3 text-sm leading-relaxed text-slate-700">
          <b>למה זה קורה דווקא בזרם מסוים?</b> הגברי ה-<Tex>{'\\alpha'}</Tex> של BJT <b>עולים עם הזרם</b> (בזרמים נמוכים מאוד הם קטנים).
          פולס-השער (או מתח-פריצה, או <Tex>{'dV/dt'}</Tex>) מזרים מספיק זרם כדי להעלות את <Tex>{'\\alpha_1+\\alpha_2'}</Tex> עד 1 — ואז המשוב משתלט.
        </div>
      </Panel>

      <Panel title="לחצן ההצתה — נסו בעצמכם">
        <p className="mb-3 leading-relaxed text-slate-700">
          הגבירו את ההנעה וצפו ב-<Tex>{'\\alpha_1+\\alpha_2'}</Tex> מטפס לעבר 1, וב-<Tex>{'I_A'}</Tex> מתפרץ ברגע הנעילה:
        </p>
        <LatchExplorer />
      </Panel>
    </div>
  )
}
