import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import Readout from '../components/Readout'
import MetalSemiconductorBandDiagram from '../components/MetalSemiconductorBandDiagram'
import SchottkyIVCurve from '../components/SchottkyIVCurve'
import {
  MATERIALS,
  MATERIAL_LIST,
  METALS,
  METAL_LIST,
  fmtCurrentDensity,
  fmtDoping,
  fmtLength,
  fmtVolt,
  schottkyState,
  type Material,
} from '../../../lib/junction'

type Preset = { labelHe: string; metal: string; mat: Material['key']; expNd: number; noteHe: string }
const PRESETS: Preset[] = [
  { labelHe: 'Pt/Si — מחסום גבוה', metal: 'Pt', mat: 'Si', expNd: 17, noteHe: 'פלטינה ($\\varphi_m=5.65$) על Si → $\\varphi_B\\approx1.6$eV: מחסום גבוה, $J_{ST}$ זעיר, מתח-הצתה גבוה.' },
  { labelHe: 'Ti/Si — מחסום נמוך', metal: 'Ti', mat: 'Si', expNd: 17, noteHe: 'טיטניום ($\\varphi_m=4.33$) על Si → $\\varphi_B\\approx0.28$eV: מחסום נמוך, $J_{ST}$ גדול, נדלקת מוקדם מאוד.' },
  { labelHe: 'Au/GaAs', metal: 'Au', mat: 'GaAs', expNd: 17, noteHe: 'זהב על GaAs: שימו לב ש-$A^{*}$ של GaAs קטן פי ~13 מ-Si — $J_{ST}$ קטן בהתאם.' },
]

/**
 * Lecture 2ג — sandbox. Pick the metal, semiconductor and doping; one schottkyState
 * call drives the band diagram, the I–V, and the readouts (φ_B, ξ, V_bi, J_ST,
 * turn-on, W) plus a rectifying/degenerate badge.
 */
export default function SandboxTab() {
  const [metalKey, setMetalKey] = useState('W')
  const [matKey, setMatKey] = useState<Material['key']>('Si')
  const [expNd, setExpNd] = useState(17)
  const [Va, setVa] = useState(0.2)
  const [activePreset, setActivePreset] = useState<string | null>(null)

  const metal = METALS[metalKey]
  const mat = MATERIALS[matKey]
  const Nd = 10 ** expNd
  const st = useMemo(() => schottkyState(metal, mat, Nd, Va), [metal, mat, Nd, Va])

  const applyPreset = (p: Preset) => {
    setMetalKey(p.metal)
    setMatKey(p.mat)
    setExpNd(p.expNd)
    setActivePreset(p.labelHe)
  }
  const note = PRESETS.find((p) => p.labelHe === activePreset)?.noteHe
  const clear = () => setActivePreset(null)

  return (
    <div className="flex flex-col gap-5">
      <Panel title="ארגז חול — מתכת, חומר, סימום">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-slate-600">
            <span aria-hidden>🎛️</span> מצבים מוכרים
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.labelHe}
                onClick={() => applyPreset(p)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                  activePreset === p.labelHe ? 'border-violet-500 bg-violet-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                {p.labelHe}
              </button>
            ))}
          </div>
          {note && (
            <p className="mt-3 rounded-lg bg-violet-50/70 px-3 py-2 text-sm leading-relaxed text-slate-600">
              <RichText>{note}</RichText>
            </p>
          )}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-slate-600">מתכת:</span>
                {METAL_LIST.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => { setMetalKey(m.key); clear() }}
                    className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
                      m.key === metalKey ? 'border-violet-500 bg-violet-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {m.key} <span className="text-xs opacity-70">{m.phiM}</span>
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-slate-600">מל"מ:</span>
                {MATERIAL_LIST.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => { setMatKey(m.key); clear() }}
                    className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
                      m.key === matKey ? 'border-sky-500 bg-sky-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {m.key}
                  </button>
                ))}
              </div>
              <Slider label={<>סימום · <Tex>{'N_D'}</Tex></>} value={expNd} min={15} max={19} onChange={(v) => { setExpNd(v); clear() }} display={<Tex>{`${fmtDoping(Nd)}\\,\\mathrm{cm^{-3}}`}</Tex>} />
              <Slider label={<>ממתח · <Tex>{'V_A'}</Tex></>} value={Va} min={-0.4} max={0.6} step={0.02} onChange={setVa} display={fmtVolt(Va)} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Readout label="מחסום $\varphi_B$" value={`${st.phiB.toFixed(2)} eV`} accent="border-violet-100 bg-violet-50" />
              <Readout label="היסט $\xi$" value={`${st.xi.toFixed(2)} eV`} accent="border-sky-100 bg-sky-50" />
              <Readout label="מתח בנוי $V_{bi}$" value={fmtVolt(st.Vbi)} accent="border-amber-100 bg-amber-50" />
              <Readout label="זרם רוויה $J_{ST}$" value={fmtCurrentDensity(st.Jst)} accent="border-rose-100 bg-rose-50" />
              <Readout label="מתח-הצתה" value={fmtVolt(st.Vturn)} accent="border-emerald-100 bg-emerald-50" />
              <Readout label="רוחב מחסור $W$" value={fmtLength(st.W)} accent="border-slate-100 bg-white" />
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${st.rectifying ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {st.rectifying ? 'מיישר ✓ (φₘ > φₛ)' : 'אוהמי (φₘ < φₛ)'}
              </span>
              {st.degenerate && <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">סימום מנוון — קירוב ξ נשבר</span>}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="mb-1 text-center text-xs font-semibold text-slate-400">
                <span className="text-slate-500">דיאגרמת פסים · אנרגיה–מיקום</span> · אחרי מגע
              </p>
              <MetalSemiconductorBandDiagram metal={metal} mat={mat} Nd={Nd} Va={Va} phase="joined" />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="mb-1 text-center text-xs font-semibold text-slate-400">
                <span className="text-slate-500">אופיין I–V · זרם–מתח</span> · חצי-לוגריתמי
              </p>
              <SchottkyIVCurve metal={metal} mat={mat} Va={Va} mode="log" showTurnOn />
            </div>
          </div>
        </div>
      </Panel>
    </div>
  )
}
