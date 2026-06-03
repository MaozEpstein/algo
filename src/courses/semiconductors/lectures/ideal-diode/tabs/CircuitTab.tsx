import { Fragment, useMemo, useState, type ReactNode } from 'react'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import Readout from '../components/Readout'
import DiodeCircuit from '../components/DiodeCircuit'
import PnCurrentFlow from '../components/PnCurrentFlow'
import { MATERIALS, conductionLevel, diodeCurrents, fmtCurrentDensity, fmtVolt } from '../../../lib/junction'

const NA = 1e16
const ND = 1e17
const mat = MATERIALS.Si

interface Preset {
  labelHe: string
  va: number
  noteHe: string
}
const PRESETS: Preset[] = [
  { labelHe: 'אחורי −2V · חסום', va: -2, noteHe: 'המחסום גבוה, הדיפוזיה נחנקת — רק זרם דליפה זעיר $\\approx -I_S$.' },
  { labelHe: 'שיווי משקל · 0V', va: 0, noteHe: 'שני הזרמים מתקזזים — זרם נטו אפס.' },
  { labelHe: 'קדמי +0.5V · מתחת לברך', va: 0.5, noteHe: 'הדיודה מתחילה להיפתח, אך הזרם עדיין קטן.' },
  { labelHe: 'קדמי +0.7V · מוליך', va: 0.7, noteHe: 'מעל הברך — השסתום פתוח וזורם זרם גדול.' },
]

/** One causal lane of the rectifier flowchart: cause-steps chained by arrows into
 *  an outcome badge. RTL — steps read right→left, arrows point left (the flow). */
function FlowLane({ tone, steps, result, resultSub }: { tone: 'open' | 'eq' | 'block'; steps: ReactNode[]; result: string; resultSub: string }) {
  const stepCls =
    tone === 'open' ? 'border-amber-200 bg-amber-50 text-amber-800' : tone === 'block' ? 'border-sky-200 bg-sky-50 text-sky-800' : 'border-slate-200 bg-slate-50 text-slate-700'
  const arrowCls = tone === 'open' ? 'text-amber-400' : tone === 'block' ? 'text-sky-400' : 'text-slate-400'
  const resCls = tone === 'open' ? 'bg-emerald-500' : tone === 'block' ? 'bg-rose-500' : 'bg-slate-400'
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      {steps.map((s, i) => (
        <Fragment key={i}>
          <span className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${stepCls}`}>{s}</span>
          <span className={`text-base font-bold ${arrowCls}`} aria-hidden>←</span>
        </Fragment>
      ))}
      <span className={`rounded-lg px-3 py-1 text-sm font-bold text-white shadow-sm ${resCls}`}>
        {result}
        <span className="ms-1 text-[11px] font-medium opacity-90">· {resultSub}</span>
      </span>
    </div>
  )
}

/**
 * Lecture 2א — the tangible "does current flow?" playground: opens with the
 * rectifier idea as a 3-state flowchart (forward / equilibrium / reverse), then
 * drag V_A (or pick a preset) and watch the diode circuit conduct or block, the
 * bulb brighten, and the charge stream thicken/quicken with the current. Driven
 * by conductionLevel + diodeCurrents so it stays consistent with the I–V curve.
 */
export default function CircuitTab() {
  const [Va, setVa] = useState(0.7)
  const { J, level } = useMemo(() => {
    return { J: diodeCurrents(NA, ND, mat, Va, 300).J, level: conductionLevel(NA, ND, mat, Va, 300) }
  }, [Va])

  const activePreset = PRESETS.find((p) => Math.abs(p.va - Va) < 1e-9)
  const stateHe = Va < 0 ? 'חוסם' : level > 0.55 ? 'מוליך' : level > 0.12 ? 'מוליך חלש' : 'כמעט אין זרם'

  return (
    <div className="flex flex-col gap-5">
      <Panel title="מוליך או חוסם? — הדיודה במעגל">
        {/* the rectifier idea as a flowchart — three states of the same junction */}
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-l from-emerald-50 to-white p-4">
          <p className="flex items-center gap-2 text-base font-bold text-emerald-800">
            <span aria-hidden>🔌</span> זו הדיודה — שסתום חד-כיווני
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            הא-סימטריה היא כל הסיפור — אותו צומת, שלושה מצבים:
          </p>

          <FlowLane
            tone="open"
            steps={['ממתח קדמי', 'המחסום יורד', 'הדיפוזיה מתפוצצת']}
            result="מוליך"
            resultSub="השסתום פתוח"
          />
          <FlowLane
            tone="eq"
            steps={['שיווי משקל', 'המחסום ללא שינוי', 'דיפוזיה = סחיפה']}
            result="מאוזן"
            resultSub="אין זרם נטו"
          />
          <FlowLane
            tone="block"
            steps={['ממתח אחורי', 'המחסום עולה', 'הדיפוזיה נחנקת', <>נשאר רק <Tex>{'-I_S'}</Tex></>]}
            result="חוסם"
            resultSub="השסתום סגור"
          />

          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            צומת ש<b>מוליך לכיוון אחד וחוסם בשני</b> — זו בדיוק <b>דיודה</b>. גררו את הממתח (או בחרו מצב) וראו
            זאת חי — ב<b>מעגל</b> וב<b>תוך הצומת</b> עצמו (שם הנושאים חוצים מ-<b>p</b> ל-<b>n</b>).
          </p>
        </div>

        {/* presets */}
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-slate-500">
            <span aria-hidden>🎛️</span>
            מצבים מוכרים
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => {
              const active = Math.abs(p.va - Va) < 1e-9
              return (
                <button
                  key={p.labelHe}
                  onClick={() => setVa(p.va)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 ${
                    active
                      ? 'bg-gradient-to-b from-violet-500 to-violet-600 text-white shadow-violet-500/30'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-700'
                  }`}
                >
                  {p.labelHe}
                </button>
              )
            })}
          </div>
          {activePreset && (
            <p className="mt-3 rounded-lg bg-violet-50/70 px-3 py-2 text-sm leading-relaxed text-violet-900">
              <RichText>{activePreset.noteHe}</RichText>
            </p>
          )}
        </div>

        {/* controls + readouts (full width) */}
        <div className="mt-4 flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <Slider
              label={<>ממתח · <Tex>{'V_A'}</Tex></>}
              value={Va}
              min={-2}
              max={0.9}
              step={0.01}
              onChange={setVa}
              display={fmtVolt(Va)}
            />
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Readout label="ממתח $V_A$" value={fmtVolt(Va)} accent="border-amber-100 bg-amber-50" />
            <Readout label="זרם $J$" value={fmtCurrentDensity(J)} accent="border-violet-100 bg-violet-50" />
            <Readout label="מצב" value={stateHe} accent={Va < 0 ? 'border-rose-100 bg-rose-50' : level > 0.12 ? 'border-emerald-100 bg-emerald-50' : 'border-slate-100 bg-white'} />
          </div>
          <p className="text-xs leading-relaxed text-slate-500">
            עוצמת הזרימה והבהירות נקבעות מ<b>גודל הזרם</b> (סקלה תפיסתית) — שימו לב כמה חדה ה<b>ברך</b>: בין{' '}
            <Tex>{'0.5\\,\\mathrm{V}'}</Tex> ל-<Tex>{'0.7\\,\\mathrm{V}'}</Tex> הזרם קופץ בסדרי-גודל.
          </p>
        </div>

        {/* the two synchronized visualizations, side by side */}
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="mb-1 text-center text-xs font-semibold text-slate-400">המעגל</p>
            <DiodeCircuit Va={Va} level={level} />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="mb-1 text-center text-xs font-semibold text-slate-400">בתוך הצומת — זרם בין p ל-n</p>
            <PnCurrentFlow Va={Va} level={level} />
          </div>
        </div>
      </Panel>
    </div>
  )
}
