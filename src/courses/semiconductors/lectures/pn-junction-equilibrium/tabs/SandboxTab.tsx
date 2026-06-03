import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import BandDiagram from '../../../viz/BandDiagram'
import JunctionElectrostatics from '../../../viz/JunctionElectrostatics'
import {
  MATERIALS,
  MATERIAL_LIST,
  capPerArea,
  fmtCapPerArea,
  fmtCarrier,
  fmtDoping,
  fmtField,
  fmtLength,
  fmtVolt,
  junctionState,
  niAt,
  type Material,
} from '../../../lib/junction'

interface Preset {
  labelHe: string
  na: number
  nd: number
  noteHe: string
}
const PRESETS: Preset[] = [
  { labelHe: 'סימטרי', na: 16, nd: 16, noteHe: 'שני הצדדים מסוממים שווה — אזור המחסור מתחלק שווה ביניהם.' },
  { labelHe: 'חד-צדדי n⁺p', na: 15, nd: 19, noteHe: 'צד n מסומם הרבה יותר — כמעט כל אזור המחסור והמתח הבנוי נופלים על צד p.' },
  { labelHe: 'חד-צדדי p⁺n', na: 19, nd: 15, noteHe: 'צד p מסומם הרבה יותר — כמעט כל אזור המחסור נופל על צד n.' },
  { labelHe: 'סימום כבד', na: 18, nd: 18, noteHe: 'סימום גבוה בשני הצדדים — אזור מחסור צר מאוד ושדה חזק מאוד.' },
  { labelHe: 'סימום קל', na: 15, nd: 15, noteHe: 'סימום נמוך בשני הצדדים — אזור מחסור רחב ושדה חלש.' },
]

// typical orders of magnitude for a moderately-doped Si junction at 300K — a
// reference table so learners can sanity-check the live readouts above
const TYPICAL: { he: string; tex: string; val: string }[] = [
  { he: 'מתח בנוי', tex: 'V_{bi}', val: '0.6\\!-\\!0.9\\,\\mathrm{V}' },
  { he: 'רוחב המחסור', tex: 'd', val: '0.1\\!-\\!1\\,\\mathrm{\\mu m}' },
  { he: 'שדה שיא', tex: 'E_{max}', val: '10^{4}\\!-\\!10^{5}\\,\\mathrm{V/cm}' },
  { he: 'קיבול', tex: 'C/A', val: '\\sim\\!1\\!-\\!100\\,\\mathrm{nF/cm^2}' },
  { he: 'ריכוז אינטרינסי', tex: 'n_i', val: '1.5\\times10^{10}\\,\\mathrm{cm^{-3}}' },
  { he: 'מתח תרמי', tex: 'kT/q', val: '25.85\\,\\mathrm{mV}' },
]

function Readout({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className={`rounded-xl border px-3 py-2 text-center ${accent}`}>
      <span className="block text-xs text-slate-500">
        <RichText>{label}</RichText>
      </span>
      <span className="block font-mono text-base font-bold text-slate-800">{value}</span>
    </div>
  )
}

/**
 * Lecture 1א — interactive sandbox: drag each side's doping and pick a material,
 * and watch the band diagram, the ρ→E→V cascade and all the numbers (V_bi, d,
 * d_n, d_p, E_max, C/A) update live. Includes special-case presets and the
 * rules of thumb. Its own tab so the playground stands on its own.
 */
export default function SandboxTab() {
  const [expNa, setExpNa] = useState(16)
  const [expNd, setExpNd] = useState(17)
  const [matKey, setMatKey] = useState<Material['key']>('Si')
  const [T, setT] = useState(300) // temperature (K) — default = room temperature
  const mat = MATERIALS[matKey]
  const Na = 10 ** expNa
  const Nd = 10 ** expNd
  const state = useMemo(() => junctionState(Na, Nd, mat, 0, T), [Na, Nd, mat, T])
  const activePreset = PRESETS.find((p) => p.na === expNa && p.nd === expNd)

  return (
    <div className="flex flex-col gap-5">
      <Panel title="ארגז חול — שחקו עם הצומת">
        <p className="leading-relaxed text-slate-600">
          גררו את הסימום של כל צד ובחרו חומר — וראו בזמן אמת איך משתנים דיאגרמת הפסים, מפל{' '}
          <span dir="ltr" className="font-mono">ρ→E→V</span>, וכל הגדלים.
        </p>
        {/* rule-of-thumb callout — header on its own line, the rule below */}
        <div className="mt-3 rounded-xl border border-violet-100 bg-violet-50/60 px-4 py-3">
          <p className="mb-2 text-sm font-semibold text-violet-700">💡 כללי אצבע</p>
          <ol className="list-decimal space-y-2 ps-6 text-sm leading-relaxed text-slate-600 marker:font-bold marker:text-violet-500">
            <li>
              <span className="inline-flex flex-wrap items-center gap-2 align-middle">
                <span className="rounded-lg bg-white px-3 py-1 font-medium text-slate-700 ring-1 ring-slate-200">
                  סימום כבד יותר
                </span>
                <span className="text-lg font-bold leading-none text-violet-500" aria-hidden>
                  ←
                </span>
                <span className="rounded-full bg-white px-2.5 py-1 font-medium text-slate-600 ring-1 ring-slate-200">
                  אזור מחסור צר יותר
                </span>
                <span className="text-slate-400" aria-hidden>
                  +
                </span>
                <span className="rounded-full bg-white px-2.5 py-1 font-medium text-slate-600 ring-1 ring-slate-200">
                  שדה חזק יותר
                </span>
              </span>
            </li>
            <li>
              <b>צומת חד-צדדי:</b> כמעט כל אזור המחסור (וגם רוב המתח הבנוי) נופל ב<b>צד המסומם פחות</b> —
              כי <Tex>{'N_A d_p = N_D d_n'}</Tex>.
            </li>
            <li>
              <b>המתח הבנוי כמעט לא תלוי בסימום:</b> הכפלת הסימום פי 10 מוסיפה ל-<Tex>{'V_{bi}'}</Tex> רק
              <Tex>{'\\sim\\!60\\,mV'}</Tex> (סקאלה לוגריתמית).
            </li>
            <li>
              <b>חסם עליון:</b> תמיד <Tex>{'V_{bi} < E_g/q'}</Tex> — המתח הבנוי לא יכול לעבור את פער האנרגיה.
            </li>
            <li>
              <b>חומר עם פער גדול יותר</b> (<Tex>{'n_i'}</Tex> קטן יותר) ⇐ <Tex>{'V_{bi}'}</Tex> גבוה יותר.
              נסו להחליף חומר: <span dir="ltr" className="font-mono">GaAs &gt; Si &gt; Ge</span>.
            </li>
            <li>
              <b>השדה משולש:</b> שיא בדיוק בצומת (<Tex>{'E_{max}'}</Tex>), אפס בקצוות אזור המחסור.
            </li>
          </ol>
        </div>

        {/* special-case presets */}
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-slate-500">
            <span aria-hidden>🎛️</span>
            מקרים מיוחדים
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => {
              const active = expNa === p.na && expNd === p.nd
              return (
                <button
                  key={p.labelHe}
                  onClick={() => {
                    setExpNa(p.na)
                    setExpNd(p.nd)
                  }}
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

        {/* Controls + readouts sit in the LEFT column, the live visuals in the
            RIGHT — so on a wide screen you drag a slider and watch the numbers
            *and* the band diagram change side-by-side, without scrolling. On
            narrow screens it stacks (controls → numbers → graphs). */}
        <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:items-start">
          {/* left: the knobs you turn + the numbers they move */}
          <div className="flex flex-col gap-4">
            {/* controls */}
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
              <Slider
                label={<>טמפרטורה · <Tex>{'T'}</Tex></>}
                value={T}
                min={250}
                max={450}
                step={5}
                onChange={setT}
                display={`${T} K`}
              />
            </div>

            {/* numeric readouts */}
            <div className="grid grid-cols-2 gap-2 xl:grid-cols-3">
              <Readout label="מתח בנוי $V_{bi}$" value={fmtVolt(state.Vbi)} accent="border-sky-100 bg-sky-50" />
              <Readout label="רוחב כולל $d$" value={fmtLength(state.d)} accent="border-slate-100 bg-white" />
              <Readout label="$d_n$ (צד n)" value={fmtLength(state.dn)} accent="border-slate-100 bg-white" />
              <Readout label="$d_p$ (צד p)" value={fmtLength(state.dp)} accent="border-slate-100 bg-white" />
              <Readout label="שדה שיא $E_{max}$" value={fmtField(state.Emax)} accent="border-amber-100 bg-amber-50" />
              <Readout label={'קיבול $C/A=\\varepsilon_s/d$'} value={fmtCapPerArea(capPerArea(mat.epsR, state.d))} accent="border-violet-100 bg-violet-50" />
              <Readout label={'ריכוז אינטרינסי $n_i$'} value={`${fmtCarrier(niAt(mat, T))} cm⁻³`} accent="border-rose-100 bg-rose-50" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm leading-relaxed text-slate-500">
                אזור המחסור מתנהג כ<b>קבל</b>: הקיבול ליחידת שטח הוא <Tex>{'C/A = \\varepsilon_s/d'}</Tex> — ככל
                שהאזור צר יותר (סימום כבד או הטיה קדמית), הקיבול גדול יותר. זה יהיה מרכזי במיתוג הדיודה בהמשך.
              </p>
              <p className="text-sm leading-relaxed text-slate-500">
                <b>טמפרטורה:</b> ככל ש-<Tex>{'T'}</Tex> עולה, <Tex>{'n_i'}</Tex> גדל מעריכית ולכן{' '}
                <Tex>{'V_{bi}'}</Tex> <b>יורד</b> (ברירת המחדל היא טמפרטורת החדר, 300K).
              </p>
            </div>
          </div>

          {/* right: live visuals — react in real time to the controls on the left */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="mb-1 text-center text-xs font-semibold text-slate-400">דיאגרמת הפסים</p>
              <BandDiagram state={state} Na={Na} Nd={Nd} mat={mat} T={T} />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="mb-1 text-center text-xs font-semibold text-slate-400">ρ → E → V</p>
              <JunctionElectrostatics dn={state.dn} dp={state.dp} Emax={state.Emax} Vbi={state.Vbi} Na={Na} Nd={Nd} />
            </div>
          </div>
        </div>

      </Panel>

      {/* its own collapsible panel — a reference table to sanity-check the live readouts */}
      <Panel title="📐 סדרי-גודל טיפוסיים — Si, 300K">
        <p className="leading-relaxed text-slate-600">
          ערכים מקורבים לצומת צורן בסימום בינוני — להשוואה מול המספרים החיים שבארגז החול.
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
