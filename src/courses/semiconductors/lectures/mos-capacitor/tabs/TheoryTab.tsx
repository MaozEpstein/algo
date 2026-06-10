import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import ProofModal from '../components/ProofModal'
import PsiAxisMap from '../components/PsiAxisMap'
import SurfaceChargeChart from '../components/SurfaceChargeChart'

/** Lesson 6 — the rigorous MOS-capacitor theory (assumptions → definitions → ψ_s states → Q_s → V_T). */
export default function TheoryTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="הנחות-היסוד של המודל">
        <ul className="list-inside list-disc space-y-1.5 leading-relaxed text-slate-700">
          <li>מבנה <b>חד-ממדי</b> (כל הגדלים תלויים ב-<Tex>{'x'}</Tex> בלבד).</li>
          <li><b>שיווי-משקל</b> — אין זרם דרך האוקסיד המבודד, ולכן <Tex>{'E_F'}</Tex> <b>שטוח</b> לכל אורך המל"מ.</li>
          <li>סימום <b>אחיד</b> במצע ו<b>יינון מלא</b> של הזיהומים.</li>
          <li>קירוב <b>אזור-המחסור</b> (גבולות חדים) בחישוב המטען.</li>
          <li>מטעני-תחמוצת (אם יש) <b>מרוכזים ליד הממשק</b> Si/SiO₂.</li>
        </ul>
      </Panel>

      <Panel title="הגדרות">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4 text-center">
            <Tex block>{'N = N_D - N_A'}</Tex>
            <p className="mt-1 text-xs text-slate-500">סימום אפקטיבי — <Tex>{'N>0'}</Tex> ל-n, <Tex>{'N<0'}</Tex> ל-p</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 text-center">
            <Tex block>{'\\rho(x) = q\\,(p - n + N)'}</Tex>
            <p className="mt-1 text-xs text-slate-500">צפיפות מטען מרחבית</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 text-center">
            <Tex block>{'n_s = n_{p0}e^{\\beta\\psi_s},\\; p_s = p_{p0}e^{-\\beta\\psi_s}'}</Tex>
            <p className="mt-1 text-xs text-slate-500">ריכוזים בשפה (בולצמן), <Tex>{'\\beta=q/kT'}</Tex></p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          ככל שהפסים מתכופפים ב-<Tex>{'\\psi(x)'}</Tex>, הריכוזים משתנים מעריכית: <Tex>{'n(\\psi)=n_{p0}e^{\\beta\\psi}'}</Tex>
          ו-<Tex>{'p(\\psi)=p_{p0}e^{-\\beta\\psi}'}</Tex>. פוטנציאל פני-השטח <Tex>{'\\psi_s'}</Tex> הוא הכיפוף בשפה.
        </p>
      </Panel>

      <Panel title={<>מצבי-הפעולה לפי פוטנציאל פני-השטח <Tex>{'\\psi_s'}</Tex></>}>
        <PsiAxisMap />
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm leading-relaxed text-slate-600">
          <li><Tex>{'\\psi_s<0'}</Tex> — <b>הצטברות</b> (חורים נצברים בשפה).</li>
          <li><Tex>{'\\psi_s=0'}</Tex> — <b>flat-band</b>.</li>
          <li><Tex>{'0<\\psi_s<\\phi_F'}</Tex> — <b>מחסור</b>.</li>
          <li><Tex>{'\\psi_s=\\phi_F'}</Tex> — בשפה <Tex>{'n_s=p_s=n_i'}</Tex> (אינטרינזי).</li>
          <li><Tex>{'\\phi_F<\\psi_s<2\\phi_F'}</Tex> — <b>היפוך חלש</b>.</li>
          <li><Tex>{'\\psi_s\\ge2\\phi_F'}</Tex> — <b>היפוך חזק</b> (סף הערוץ).</li>
        </ul>
      </Panel>

      <Panel title={<>משוואת המטען על פני-השטח <Tex>{'Q_s'}</Tex></>}>
        <p className="leading-relaxed text-slate-700">
          פתרון משוואת פואסון נותן את מטען פני-השטח הכולל כפונקציה של <Tex>{'\\psi_s'}</Tex>:
        </p>
        <div className="my-3 overflow-x-auto rounded-xl bg-slate-50 p-4 text-center">
          <Tex block>{'|Q_s| = \\sqrt{\\,2\\varepsilon_s q V_T\\left[\\,N_A\\!\\left(e^{-\\beta\\psi_s}+\\beta\\psi_s-1\\right) + \\dfrac{n_i^2}{N_A}\\!\\left(e^{\\beta\\psi_s}-\\beta\\psi_s-1\\right)\\right]}'}</Tex>
        </div>
        <div className="mb-3">
          <ProofModal title="גזירת מטען פני-השטח (פואסון)" label="הצג הוכחה (פואסון)">
            <p>בבולק (<Tex>{'\\psi=0'}</Tex>) הניטרליות נותנת <Tex>{'N=-(p_{p0}-n_{p0})'}</Tex>, ולכן:</p>
            <Tex block>{'\\rho(\\psi)=q\\left[p_{p0}\\!\\left(e^{-\\beta\\psi}-1\\right)-n_{p0}\\!\\left(e^{\\beta\\psi}-1\\right)\\right]'}</Tex>
            <p className="mt-2">משוואת פואסון החד-ממדית:</p>
            <Tex block>{'\\dfrac{d^2\\psi}{dx^2}=-\\dfrac{\\rho(\\psi)}{\\varepsilon_s}'}</Tex>
            <p className="mt-2">מכפילים ב-<Tex>{'2\\,d\\psi/dx'}</Tex> ומבצעים אינטגרל ראשון (מהבולק אל השפה) → השדה בשפה:</p>
            <Tex block>{'E_s=\\mp\\sqrt{\\dfrac{2}{\\varepsilon_s}\\left|\\int_0^{\\psi_s}\\rho(\\psi)\\,d\\psi\\right|}'}</Tex>
            <p className="mt-2">לפי גאוס המטען הכולל במל"מ הוא <Tex>{'Q_s=-\\varepsilon_s E_s'}</Tex>, ומהצבת <Tex>{'\\rho(\\psi)'}</Tex> מתקבלת הנוסחה המלאה למעלה.</p>
          </ProofModal>
        </div>
        <SurfaceChargeChart />
      </Panel>

      <Panel title={<>מתח-הסף <Tex>{'V_T'}</Tex></>}>
        <p className="leading-relaxed text-slate-700">
          מתח-השער הדרוש לתחילת <b>היפוך חזק</b> (<Tex>{'\\psi_s=2\\phi_F'}</Tex>):
        </p>
        <div className="my-3 rounded-xl border-2 border-emerald-300 bg-emerald-50/60 p-4 text-center">
          <Tex block>{'V_T = V_{FB} + 2\\phi_F + \\dfrac{|Q_{D,\\max}|}{C_{ox}}'}</Tex>
        </div>
        <ProofModal title="גזירת מתח-הסף" label="הצג הוכחה">
          <p>מאיזון המתחים והמטענים, מתח-השער הכללי הוא:</p>
          <Tex block>{'V_G = V_{FB} - \\dfrac{Q_s}{C_{ox}} + \\psi_s'}</Tex>
          <p className="mt-2">בסף ההיפוך החזק <Tex>{'\\psi_s=2\\phi_F'}</Tex>, ומטען-המל"מ הוא מטען-המחסור המרבי:</p>
          <Tex block>{'Q_{D,\\max}=-\\,q N_A W_{\\max},\\quad W_{\\max}=\\sqrt{\\dfrac{2\\varepsilon_s\\,(2\\phi_F)}{qN_A}}'}</Tex>
          <p className="mt-2">הצבה (עם <Tex>{'Q_s=Q_{D,\\max}<0'}</Tex>) נותנת:</p>
          <Tex block>{'V_T = V_{FB} + 2\\phi_F + \\dfrac{|Q_{D,\\max}|}{C_{ox}}'}</Tex>
        </ProofModal>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          (כאן <Tex>{'V_{FB}'}</Tex> הוא מתח ה-flat-band; מעבר ל-<Tex>{'V_T'}</Tex> נוצר ערוץ-ההיפוך — בדיוק תעלת ה-MOSFET.)
        </p>
      </Panel>
    </div>
  )
}
