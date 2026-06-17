import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import PlayButton from '../../../components/PlayButton'
import { useAutoSweep } from '../../../components/useAutoSweep'
import BiasedBandDiagram from '../components/BiasedBandDiagram'
import Readout from '../components/Readout'
import JunctionElectrostatics from '../../../viz/JunctionElectrostatics'
import {
  MATERIALS,
  MATERIAL_LIST,
  capPerArea,
  fmtCapPerArea,
  fmtDoping,
  fmtField,
  fmtLength,
  fmtVolt,
  junctionState,
  thermalVoltage,
  type Material,
} from '../../../lib/junction'

interface Preset {
  labelHe: string
  va: number
  noteHe: string
}
const PRESETS: Preset[] = [
  { labelHe: 'שיווי משקל', va: 0, noteHe: 'אין מתח חיצוני — נקודת הייחוס מחלק א׳.' },
  { labelHe: 'קדמי קל +0.3V', va: 0.3, noteHe: 'המחסום ירד מעט, אזור המחסור התחיל להצטמצם — ההזרקה כבר ניכרת.' },
  { labelHe: 'קדמי +0.6V', va: 0.6, noteHe: 'מחסום נמוך, מחסור צר וקיבול גבוה — הדיודה "נפתחת" וזורם זרם גדול.' },
  { labelHe: 'אחורי −2V', va: -2, noteHe: 'מחסום גבוה, אזור מחסור רחב ושדה חזק — זורם רק זרם דליפה זעיר.' },
]

// typical orders of magnitude for a Si junction under bias (300K) — a reference
// to sanity-check the live readouts
const TYPICAL: { he: string; tex: string; val: string }[] = [
  { he: 'מתח הצתה (קדמי)', tex: 'V_{on}', val: '0.6\\!-\\!0.7\\,\\mathrm{V}' },
  { he: 'מתח בנוי', tex: 'V_{bi}', val: '0.7\\!-\\!0.9\\,\\mathrm{V}' },
  { he: 'רוחב המחסור', tex: 'd', val: '0.1\\!-\\!1\\,\\mathrm{\\mu m}' },
  { he: 'שדה שיא', tex: 'E_{max}', val: '10^{4}\\!-\\!10^{5}\\,\\mathrm{V/cm}' },
  { he: 'קיבול מחסור', tex: 'C_j/A', val: '\\sim\\!1\\!-\\!100\\,\\mathrm{nF/cm^2}' },
  { he: 'שדה פריצה (Si)', tex: 'E_{BR}', val: '\\sim\\!3\\times10^{5}\\,\\mathrm{V/cm}' },
]

/**
 * Lecture 1ב — interactive sandbox: pick a material + each side's doping, then
 * sweep the applied bias V_A from reverse through equilibrium to forward and
 * watch the biased band diagram, the ρ→E→V cascade and all the numbers (the
 * barrier q(V_bi−V_A), d, E_max, C_j/A, the injection factor) respond live.
 */
export default function SandboxTab() {
  const [expNa, setExpNa] = useState(16)
  const [expNd, setExpNd] = useState(17)
  const [matKey, setMatKey] = useState<Material['key']>('Si')
  const [Va, setVa] = useState(0.3)
  const mat = MATERIALS[matKey]
  const Na = 10 ** expNa
  const Nd = 10 ** expNd

  const vbi = useMemo(() => junctionState(Na, Nd, mat, 0).Vbi, [Na, Nd, mat])
  const vMax = Math.max(0.1, 0.9 * vbi) // clamp forward so the depletion never collapses
  const vaEff = Math.min(Va, vMax)
  const state = useMemo(() => junctionState(Na, Nd, mat, vaEff), [Na, Nd, mat, vaEff])
  // fixed x-frame (widest case = the most-reverse slider value), so the depletion
  // band visibly narrows toward forward / widens toward reverse as V_A changes
  const xMaxRef = useMemo(() => {
    const r = junctionState(Na, Nd, mat, -5)
    return Math.max(r.dn, r.dp) * 2.2
  }, [Na, Nd, mat])
  const capA = capPerArea(mat.epsR, state.d)
  const factor = Math.exp(vaEff / thermalVoltage(300))
  const sweep = useAutoSweep({ min: -5, max: vMax, value: vaEff, onChange: (v) => setVa(Math.min(v, vMax)) })
  const activePreset = PRESETS.find((p) => Math.abs(p.va - vaEff) < 1e-9)

  return (
    <div className="flex flex-col gap-5">
      <Panel title="ארגז חול — הצומת תחת ממתח">
        <p className="leading-relaxed text-slate-600">
          בחרו חומר וסימום, ואז גררו את <b>המתח החיצוני</b> <Tex>{'V_A'}</Tex>: שמאלה ל<b>ממתח אחורי</b>, דרך
          שיווי-משקל, וימינה ל<b>ממתח קדמי</b> — וראו בזמן אמת איך משתנים המחסום, רוחב המחסור, השדה והקיבול.
        </p>

        {/* rules of thumb */}
        <div className="mt-3 rounded-xl border border-violet-100 bg-violet-50/60 px-4 py-3">
          <p className="mb-2 text-sm font-semibold text-violet-700">💡 כללי אצבע</p>
          <ol className="list-decimal space-y-2 ps-6 text-sm leading-relaxed text-slate-600 marker:font-bold marker:text-violet-500">
            <li>
              <b>ממתח קדמי</b> (<Tex>{'V_A>0'}</Tex>): מחסום <b>יורד</b> · מחסור <b>צר</b> · קיבול <b>גדל</b> · הזרקה
              מעריכית.
            </li>
            <li>
              <b>ממתח אחורי</b> (<Tex>{'V_A<0'}</Tex>): מחסום <b>עולה</b> · מחסור <b>רחב</b> · קיבול <b>קטֵן</b> · רק
              זרם דליפה זעיר.
            </li>
            <li>המתח החיצוני נופל כולו על אזור המחסור, והמפל הפעיל הוא <Tex>{'V_{bi}-V_A'}</Tex>.</li>
            <li>הפער בין רמות הקוואזי-פרמי שווה בדיוק ל-<Tex>{'qV_A'}</Tex>.</li>
          </ol>
        </div>

        {/* presets */}
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-2.5 flex items-center justify-between gap-2 text-sm font-semibold text-slate-500">
            <span className="flex items-center gap-2"><span aria-hidden>🎛️</span> מצבי ממתח</span>
            <PlayButton playing={sweep.playing} onClick={sweep.toggle} label="הרצת ממתח" />
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => {
              const active = Math.abs(p.va - vaEff) < 1e-9
              return (
                <button
                  key={p.labelHe}
                  onClick={() => sweep.setManual(p.va)}
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
              {activePreset.noteHe}
            </p>
          )}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:items-start">
          {/* controls + readouts */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-slate-600">חומר:</span>
                {MATERIAL_LIST.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setMatKey(m.key)}
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                      m.key === matKey
                        ? 'border-violet-500 bg-violet-500 text-white shadow'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {m.he}
                  </button>
                ))}
              </div>
              <Slider
                label={<>מתח חיצוני · <Tex>{'V_A'}</Tex></>}
                value={vaEff}
                min={-5}
                max={Number(vMax.toFixed(2))}
                step={0.05}
                onChange={sweep.setManual}
                display={fmtVolt(vaEff)}
              />
              <Slider
                label={<>סימום צד p · <Tex>{'N_A'}</Tex></>}
                value={expNa}
                min={14}
                max={19}
                onChange={setExpNa}
                display={<Tex>{`${fmtDoping(Na)}\\,\\mathrm{cm^{-3}}`}</Tex>}
              />
              <Slider
                label={<>סימום צד n · <Tex>{'N_D'}</Tex></>}
                value={expNd}
                min={14}
                max={19}
                onChange={setExpNd}
                display={<Tex>{`${fmtDoping(Nd)}\\,\\mathrm{cm^{-3}}`}</Tex>}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 xl:grid-cols-3">
              <Readout label="מחסום $q(V_{bi}-V_A)$" value={fmtVolt(state.Vbi - vaEff)} accent="border-amber-100 bg-amber-50" />
              <Readout label="מתח בנוי $V_{bi}$" value={fmtVolt(state.Vbi)} accent="border-sky-100 bg-sky-50" />
              <Readout label="רוחב $d$" value={fmtLength(state.d)} accent="border-slate-100 bg-white" />
              <Readout label="$d_n$ (צד n)" value={fmtLength(state.dn)} accent="border-slate-100 bg-white" />
              <Readout label="$d_p$ (צד p)" value={fmtLength(state.dp)} accent="border-slate-100 bg-white" />
              <Readout label="שדה שיא $E_{max}$" value={fmtField(state.Emax)} accent="border-slate-100 bg-white" />
              <Readout label="קיבול $C_j/A$" value={fmtCapPerArea(capA)} accent="border-violet-100 bg-violet-50" />
              <Readout label="גורם הזרקה $e^{V_A/V_T}$" value={`×${factor < 1000 ? factor.toFixed(1) : factor.toExponential(1)}`} accent="border-emerald-100 bg-emerald-50" />
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              <b>ממתח קדמי</b> מצמצם את <Tex>{'d'}</Tex> ומגדיל את הקיבול ואת ההזרקה; <b>ממתח אחורי</b> עושה ההפך. הסליידר
              חסום מעט מתחת ל-<Tex>{'V_{bi}'}</Tex> (אחרת אזור המחסור היה מתאפס — קירוב המחסור נשבר שם).
            </p>
          </div>

          {/* live visuals */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="mb-1 text-center text-xs font-semibold text-slate-400">דיאגרמת הפסים תחת ממתח</p>
              <BiasedBandDiagram state={state} Va={vaEff} Na={Na} Nd={Nd} mat={mat} xMaxRef={xMaxRef} />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="mb-1 text-center text-xs font-semibold text-slate-400">ρ → E → V · מפל <Tex>{'V_{bi}-V_A'}</Tex></p>
              <JunctionElectrostatics dn={state.dn} dp={state.dp} Emax={state.Emax} Vbi={state.Vbi - vaEff} Na={Na} Nd={Nd} xMaxRef={xMaxRef} />
            </div>
          </div>
        </div>
      </Panel>

      {/* its own collapsible panel — a reference table to sanity-check the readouts */}
      <Panel title="📐 סדרי-גודל טיפוסיים — Si, 300K">
        <p className="leading-relaxed text-slate-600">
          ערכים מקורבים לצומת צורן — להשוואה מול המספרים החיים שלמעלה.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TYPICAL.map((t) => (
            <div key={t.he} className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-center">
              <span className="block text-[11px] text-slate-400">
                <span dir="ltr"><Tex>{t.tex}</Tex></span> · {t.he}
              </span>
              <span className="mt-0.5 block font-mono text-sm font-bold text-slate-700" dir="ltr">
                <Tex>{t.val}</Tex>
              </span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}
