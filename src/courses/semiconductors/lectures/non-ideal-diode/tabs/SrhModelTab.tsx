import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import StepFlow from '../../../components/StepFlow'
import GenRecombDiagram from '../../pn-junction-equilibrium/components/GenRecombDiagram'
import SrhTrapProcesses from '../components/SrhTrapProcesses'
import { MATERIALS, thermalVoltage } from '../../../lib/junction'

/** KaTeX-ready "m×10ⁿ" string. */
function sciTex(n: number): string {
  if (n <= 0) return '0'
  const e = Math.floor(Math.log10(n))
  const m = n / 10 ** e
  return `${m.toFixed(1)}\\times10^{${e}}`
}

/**
 * Lecture 2ב — "מודל SRH": the formal derivation of the Shockley-Read-Hall
 * recombination rate, built up frame-by-frame (the four trap processes a/b/c/d →
 * equilibrium coefficients → steady-state → R_SRH). This is the learning content
 * behind תרגול 2; it feeds the J_rec of the "זרם רקומבינציה" tab.
 */
export default function SrhModelTab() {
  const ni = MATERIALS.Si.ni
  const VT = thermalVoltage(300) // ≈ kT/q in V ≡ kT in eV
  const [dEmeV, setDEmeV] = useState(0) // E_T − E_i in meV
  const dE = dEmeV / 1000
  const n1 = ni * Math.exp(dE / VT)
  const p1 = ni * Math.exp(-dE / VT)
  const rel = 1 / Math.cosh(dE / VT) // relative recombination efficiency, =1 at midgap

  return (
    <div className="flex flex-col gap-5">
      <Panel title="שלושה מנגנוני התאחדות">
        <p className="leading-relaxed text-slate-600">
          נושא-מיעוט עודף יכול להיעלם בשלוש דרכים: <b>ישירה</b> (פס-לפס, פליטת פוטון <Tex>{'h\\nu'}</Tex> — שולטת
          בחומרים בעלי פער <b>ישיר</b> כמו GaAs, וזה ה-LED!), <b>Auger</b> (העודף נמסר לנושא חופשי אחר), ו<b>בלתי-ישירה</b>{' '}
          דרך <b>מלכודות</b> <Tex>{'E_T'}</Tex> עמוק בפער האסור — המנגנון השולט ב<b>צורן (Si)</b> בעל הפער הבלתי-ישיר.
          את המנגנון האחרון נגזור כעת.
        </p>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3">
          <p className="mb-1 text-center text-xs font-semibold text-slate-400">בחרו מנגנון והריצו את המעבר — שימו לב למסלול הדו-שלבי של SRH</p>
          <GenRecombDiagram initialMode="srh" />
        </div>
      </Panel>

      <Panel title="ארבעת התהליכים במלכודת — בניית משוואות הקצב">
        <p className="leading-relaxed text-slate-600">
          ברמת מלכודת אחת <Tex>{'E_T'}</Tex> ארבעה תהליכים משנים את ריכוז הנושאים. בחרו כל תהליך כדי לראות את החץ
          המתאים ואת <b>האיבר שהוא תורם</b> למשוואות הקצב. <Tex>{'n_T'}</Tex> = מלכודות מלאות, <Tex>{'p_T'}</Tex> = ריקות
          (<Tex>{'N_T=n_T+p_T'}</Tex>).
        </p>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3">
          <SrhTrapProcesses />
        </div>
      </Panel>

      <Panel title="שיווי משקל — הקשר בין מקדמי הפליטה ללכידה">
        <p className="leading-relaxed text-slate-600">
          בשיווי-משקל תרמי אין שינוי בריכוזים (<Tex>{'dn/dt=dp/dt=0'}</Tex>), וכל איבר לכידה מתאזן עם הפליטה ההפוכה.
          מכאן מקדמי הפליטה מתבטאים דרך מקדמי הלכידה:
        </p>
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center">
          <Tex block>{'E_n=C_n n_1,\\qquad E_p=C_p p_1'}</Tex>
        </div>
        <StepFlow
          tone="reverse"
          steps={[
            { title: <>רמות עזר</>, body: <span dir="ltr"><Tex>{'n_1=n_i e^{(E_T-E_i)/kT}'}</Tex></span> },
            { title: <>ובהתאמה</>, body: <span dir="ltr"><Tex>{'p_1=n_i e^{(E_i-E_T)/kT}'}</Tex></span> },
            { title: <>זהות יפה</>, body: <Tex>{'n_1 p_1=n_i^2'}</Tex> },
          ]}
          outcome={{ label: 'n₁, p₁ = ריכוזים "וירטואליים"', sub: <>הריכוזים אילו רמת פרמי הייתה מתלכדת עם <Tex>{'E_T'}</Tex></> }}
        />
      </Panel>

      <Panel title="מצב עמיד וקצב ההתאחדות R_SRH">
        <p className="leading-relaxed text-slate-600">
          במצב עמיד הנושאים נעלמים <b>בזוגות</b> (<Tex>{'dn/dt=dp/dt'}</Tex>). דרישה זו קובעת את אכלוס המלכודות{' '}
          <span dir="ltr"><Tex>{'\\tfrac{n_T}{N_T}=f_{FD}(E_T)=\\tfrac{C_n n+C_p p_1}{C_n(n+n_1)+C_p(p+p_1)}'}</Tex></span>. מגדירים זמני-חיים{' '}
          <Tex>{'\\tau_n=1/(C_n N_T)'}</Tex>, <Tex>{'\\tau_p=1/(C_p N_T)'}</Tex>, ואחרי הצבה מתקבל הביטוי המרכזי:
        </p>
        <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-center">
          <Tex block>{'R_{SRH}=\\dfrac{np-n_i^2}{\\tau_p(n+n_1)+\\tau_n(p+p_1)}'}</Tex>
        </div>
        <p className="mt-3 leading-relaxed text-slate-600">
          המונה <Tex>{'np-n_i^2'}</Tex> מודד את <b>הסטייה משיווי-המשקל</b> (אפס בש"מ). המכנה תלוי ב-<Tex>{'n_1,p_1'}</Tex>,
          ולכן <b>במיקום המלכודת</b>: ככל ש-<Tex>{'E_T'}</Tex> קרובה לאמצע הפער, <Tex>{'n_1,p_1'}</Tex> קטֵנים, המכנה קטן
          וההתאחדות <b>יעילה</b> יותר. נסו:
        </p>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <Slider
            label={<>מיקום המלכודת · <Tex>{'E_T-E_i'}</Tex></>}
            value={dEmeV}
            min={-300}
            max={300}
            step={10}
            onChange={setDEmeV}
            display={`${dEmeV > 0 ? '+' : ''}${dEmeV} meV`}
          />
          <div className="mt-3 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-xl border border-sky-100 bg-sky-50 px-3 py-2">
              <span className="block text-xs text-slate-500"><Tex>{'n_1'}</Tex></span>
              <span className="block font-mono text-sm font-bold text-slate-800" dir="ltr"><Tex>{`${sciTex(n1)}`}</Tex></span>
            </div>
            <div className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2">
              <span className="block text-xs text-slate-500"><Tex>{'p_1'}</Tex></span>
              <span className="block font-mono text-sm font-bold text-slate-800" dir="ltr"><Tex>{`${sciTex(p1)}`}</Tex></span>
            </div>
          </div>
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>יעילות התאחדות יחסית <Tex>{'\\propto 1/\\cosh\\!\\big(\\tfrac{E_T-E_i}{kT}\\big)'}</Tex></span>
              <span className="font-mono text-slate-700">{(rel * 100).toFixed(0)}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-gradient-to-l from-violet-400 to-violet-600 transition-all" style={{ width: `${rel * 100}%` }} />
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              מקסימום ב-<b>אמצע הפער</b> (<Tex>{'E_T=E_i'}</Tex>) — לכן מלכודות עמוקות הן <b>מרכזי-התאחדות יעילים</b>,
              בעוד מלכודות רדודות בעיקר "לוכדות וזורקות" בחזרה.
            </p>
          </div>
        </div>
      </Panel>

      <Panel title="הגשר לזרם הדיודה">
        <p className="leading-relaxed text-slate-600">
          הקצב <Tex>{'R_{SRH}'}</Tex> הזה הוא בדיוק מה שמזין את <b>זרם הרקומבינציה</b> של הדיודה הלא-אידיאלית: כשהוא
          מתרחש בתוך <b>אזור המחסור</b> תחת ממתח קדמי, הוא נותן את האיבר <span dir="ltr"><Tex>{'J_{rec}\\propto e^{V_A/2V_T}'}</Tex></span>{' '}
          (מקדם <Tex>{'n=2'}</Tex>). את זה נראה בלשונית <b>«זרם רקומבינציה»</b>. כאן בנינו את ה<b>מנוע</b> הפיזיקלי שמאחוריו.
        </p>
      </Panel>
    </div>
  )
}
