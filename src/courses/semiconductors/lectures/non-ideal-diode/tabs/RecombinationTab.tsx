import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import StepFlow from '../../../components/StepFlow'
import Readout from '../components/Readout'
import NonIdealIVCurve from '../components/NonIdealIVCurve'
import GenRecombDiagram from '../../pn-junction-equilibrium/components/GenRecombDiagram'
import { MATERIALS, fmtCurrentDensity, nonIdealCurrents, thermalVoltage } from '../../../lib/junction'

const Si = MATERIALS.Si
const NA = 1e16
const ND = 1e17

/** Local ideality factor n = (1/V_T)·dV/d(ln J_tot), from a symmetric difference. */
function localN(Vj: number, tau0: number): number {
  const VT = thermalVoltage(300)
  const h = 0.01
  const j1 = nonIdealCurrents(NA, ND, Si, Vj - h, tau0).Jtot
  const j2 = nonIdealCurrents(NA, ND, Si, Vj + h, tau0).Jtot
  return (2 * h) / (VT * Math.log(j2 / j1))
}

/**
 * Lecture 2ב — the recombination current. SRH recombination inside the depletion
 * region adds an n=2 exponential that dominates at low forward bias; the live
 * semilog plot overlays J_diff (n=1) and J_rec (n=2) so the crossover is visible,
 * and a linear reverse inset shows the matching generation current is NOT saturated.
 */
export default function RecombinationTab() {
  const [Vj, setVj] = useState(0.3)
  const [tauExp, setTauExp] = useState(-7) // τ₀ = 10^tauExp s
  const tau0 = 10 ** tauExp
  const c = useMemo(() => nonIdealCurrents(NA, ND, Si, Vj, tau0), [Vj, tau0])
  const nLoc = useMemo(() => localN(Vj, tau0), [Vj, tau0])

  return (
    <div className="flex flex-col gap-5">
      <Panel title="מאיפה מגיע זרם הרקומבינציה?">
        <p className="leading-relaxed text-slate-600">
          ההנחה האידיאלית אמרה ש<b>אין</b> גנרציה-רקומבינציה באזור המחסור. במציאות יש שם <b>מלכודות</b> (SRH) —
          מצבי-אנרגיה בתוך הפער שמאיצים את התהליך. תחת ממתח קדמי, נושאים שחוצים <b>נלכדים ומתאחים בתוך אזור
          המחסור</b> במקום להמשיך — וזה זרם <b>נוסף</b> מעבר לדיפוזיה.
        </p>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3">
          <p className="mb-1 text-center text-xs font-semibold text-slate-400">מנגנון SRH דרך מלכודת — בחרו "רקומבינציה SRH" והציגו את המעבר</p>
          <GenRecombDiagram initialMode="srh" />
        </div>
      </Panel>

      <Panel title="הגזירה — למה השיפוע חצי (n=2)">
        <p className="leading-relaxed text-slate-600">
          קצב הרקומבינציה המקסימלי באזור המחסור <Tex>{'\\propto n_i'}</Tex>, והרוחב הזמין הוא <Tex>{'W'}</Tex>.
          תלות המתח באה דרך ריכוז הנושאים שם, <Tex>{'\\propto e^{V_A/2V_T}'}</Tex> (ולא <Tex>{'e^{V_A/V_T}'}</Tex>) —
          ולכן מקדם אי-האידיאליות <Tex>{'n=2'}</Tex>:
        </p>
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center">
          <Tex block>{'J_{rec}=\\frac{q\\,n_i\\,W}{2\\tau_0}\\left(e^{V_A/2V_T}-1\\right)'}</Tex>
        </div>
        <StepFlow
          tone="reverse"
          steps={[
            { title: <>מלכודות <b>SRH</b> באזור המחסור</>, body: <>קצב רקומבינציה <Tex>{'\\propto n_i/\\tau_0'}</Tex>.</> },
            { title: <>תלות המתח <b>חצי-מעריכית</b></>, body: <><Tex>{'\\propto e^{V_A/2V_T}'}</Tex> — לא <Tex>{'e^{V_A/V_T}'}</Tex>.</> },
            { title: <>שולט ב<b>קדמי נמוך</b></>, body: <>שם הדיפוזיה (<Tex>{'n=1'}</Tex>) עדיין זעירה.</> },
          ]}
          outcome={{ label: 'שיפוע n=2 בתחתית האופיין', sub: <>חצי משיפוע הדיפוזיה</> }}
        />
      </Panel>

      <Panel title="הזיזו את הממתח ואת זמן-החיים">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <Slider label={<>מתח-צומת · <Tex>{'V_j'}</Tex></>} value={Vj} min={0.05} max={0.6} step={0.01} onChange={setVj} display={`${Vj.toFixed(2)} V`} />
              <div className="mt-3">
                <Slider
                  label={<>זמן-חיים · <Tex>{'\\tau_0'}</Tex></>}
                  value={tauExp}
                  min={-9}
                  max={-5}
                  step={1}
                  onChange={setTauExp}
                  display={<Tex>{`10^{${tauExp}}\\,\\mathrm{s}`}</Tex>}
                />
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  <Tex>{'\\tau_0'}</Tex> קטֵן = יותר מלכודות = זרם רקומבינציה גדול יותר. שימו לב למקדם <Tex>{'n'}</Tex>{' '}
                  ה<b>נמדד</b>: קרוב ל-2 בקדמי נמוך, יורד ל-1 כשהדיפוזיה משתלטת.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Readout label="$J_{diff}$ (n=1)" value={fmtCurrentDensity(c.Jdiff)} accent="border-amber-100 bg-amber-50" />
              <Readout label="$J_{rec}$ (n=2)" value={fmtCurrentDensity(c.Jrec)} accent="border-emerald-100 bg-emerald-50" />
              <Readout label="$J$ כולל" value={fmtCurrentDensity(c.Jtot)} accent="border-violet-100 bg-violet-50" />
              <Readout label="מקדם נמדד $n$" value={nLoc.toFixed(2)} accent="border-sky-100 bg-sky-50" />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="mb-1 text-center text-xs font-semibold text-slate-400">חצי-לוג — דיפוזיה (אמבר), רקומבינציה (ירוק), כולל (סגול)</p>
            <NonIdealIVCurve Na={NA} Nd={ND} mat={Si} Vj={Vj} tau0={tau0} rs={0} mode="log" curves={['diff', 'rec', 'tot']} regions />
          </div>
        </div>
      </Panel>

      <Panel title="בצד האחורי — זרם גנרציה שאינו רווי">
        <p className="leading-relaxed text-slate-600">
          אותו מנגנון פועל <b>הפוך</b> בממתח אחורי: המלכודות <b>מייצרות</b> זוגות בתוך אזור המחסור, והם נסחפים החוצה.
          מכיוון שהזרם <Tex>{'\\propto W'}</Tex> ו-<Tex>{'W\\propto\\sqrt{V_{bi}+|V_A|}'}</Tex>, הזרם האחורי{' '}
          <b>גדל</b> עם המתח — בניגוד לקו השטוח <Tex>{'-J_S'}</Tex> של הדיודה האידיאלית.
        </p>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3">
          <p className="mb-1 text-center text-xs font-semibold text-slate-400">הזרם האחורי (לינארי) — ממשי (אדום) מול אידיאלי שטוח</p>
          <NonIdealIVCurve Na={NA} Nd={ND} mat={Si} Vj={Vj} tau0={tau0} rs={0} mode="reverse" />
        </div>
      </Panel>
    </div>
  )
}
