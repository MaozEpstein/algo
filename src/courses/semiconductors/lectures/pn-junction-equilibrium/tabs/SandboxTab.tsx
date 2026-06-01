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
  fmtDoping,
  fmtField,
  fmtLength,
  fmtVolt,
  junctionState,
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

export default function SandboxTab() {
  const [expNa, setExpNa] = useState(16)
  const [expNd, setExpNd] = useState(17)
  const [matKey, setMatKey] = useState<Material['key']>('Si')
  const mat = MATERIALS[matKey]
  const Na = 10 ** expNa
  const Nd = 10 ** expNd
  const state = useMemo(() => junctionState(Na, Nd, mat), [Na, Nd, mat])
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
          <p className="mb-2 text-sm font-semibold text-violet-700">💡 כלל אצבע</p>
          <div className="flex flex-wrap items-center gap-2 text-sm">
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
          </div>
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

        {/* controls */}
        <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
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
        </div>

        {/* numeric readouts */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
          <Readout label="מתח בנוי $V_{bi}$" value={fmtVolt(state.Vbi)} accent="border-sky-100 bg-sky-50" />
          <Readout label="רוחב כולל $d$" value={fmtLength(state.d)} accent="border-slate-100 bg-white" />
          <Readout label="$d_n$ (צד n)" value={fmtLength(state.dn)} accent="border-slate-100 bg-white" />
          <Readout label="$d_p$ (צד p)" value={fmtLength(state.dp)} accent="border-slate-100 bg-white" />
          <Readout label="שדה שיא $E_{max}$" value={fmtField(state.Emax)} accent="border-amber-100 bg-amber-50" />
        </div>

        {/* live visuals */}
        <div className="mt-4 flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="mb-1 text-center text-xs font-semibold text-slate-400">דיאגרמת הפסים</p>
            <BandDiagram state={state} Na={Na} Nd={Nd} mat={mat} />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="mb-1 text-center text-xs font-semibold text-slate-400">ρ → E → V</p>
            <JunctionElectrostatics dn={state.dn} dp={state.dp} Emax={state.Emax} Vbi={state.Vbi} Na={Na} Nd={Nd} />
          </div>
        </div>
      </Panel>
    </div>
  )
}
