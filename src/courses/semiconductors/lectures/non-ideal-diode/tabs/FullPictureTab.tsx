import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import Readout from '../components/Readout'
import NonIdealIVCurve from '../components/NonIdealIVCurve'
import IdealityCurve from '../components/IdealityCurve'
import {
  MATERIALS,
  MATERIAL_LIST,
  diodeCurrents,
  fmtCurrentDensity,
  fmtDoping,
  fmtVolt,
  logFloor,
  nonIdealCurrents,
  terminalVoltage,
  thermalVoltage,
  type Material,
} from '../../../lib/junction'

type Preset = { labelHe: string; tauExp: number; rs: number; noteHe: string }
const PRESETS: Preset[] = [
  { labelHe: 'דיודה איכותית', tauExp: -5, rs: 0.2, noteHe: 'זמן-חיים ארוך ($\\tau_0=10^{-5}$) → רקומבינציה זניחה; $R_S$ קטן. כמעט אידיאלית.' },
  { labelHe: 'דולפת (זמן-חיים קצר)', tauExp: -9, rs: 0.2, noteHe: 'הרבה מלכודות ($\\tau_0=10^{-9}$) → זרם רקומבינציה גדול, אזור $n=2$ רחב בתחתית.' },
  { labelHe: 'דיודת הספק', tauExp: -7, rs: 4, noteHe: 'התנגדות טורית גבוהה $R_S=4\\,\\Omega\\cdot cm^2$ → ברך חדה בזרם גבוה; האופיין מתיישר רזיסטיבית.' },
]

/** Local ideality factor n = (1/V_T)·dV/d(ln J_tot) at the operating point. */
function localN(Na: number, Nd: number, mat: Material, Vj: number, tau0: number, T: number): number {
  const VT = thermalVoltage(T)
  const h = 0.01
  const j1 = nonIdealCurrents(Na, Nd, mat, Vj - h, tau0, T).Jtot
  const j2 = nonIdealCurrents(Na, Nd, mat, Vj + h, tau0, T).Jtot
  return (2 * h) / (VT * Math.log(j2 / j1))
}

/**
 * Lecture 2ב — the full picture. One live semilog plot carries every deviation:
 * recombination (n=2) low, diffusion (n=1) mid, high-current R_s bend, against the
 * dashed ideal line and a dashed lumped-n model whose n is the EMERGENT local
 * slope (a read-out, not a dial). Sliders for τ₀, R_s, doping, T, material + presets.
 */
export default function FullPictureTab() {
  const [matKey, setMatKey] = useState<Material['key']>('Si')
  const [expNa, setExpNa] = useState(16)
  const [expNd, setExpNd] = useState(17)
  const [tauExp, setTauExp] = useState(-7)
  const [rs, setRs] = useState(1)
  const [Vj, setVj] = useState(0.45)
  const [T, setT] = useState(300)
  const [activePreset, setActivePreset] = useState<string | null>(null)

  const mat = MATERIALS[matKey]
  const Na = 10 ** expNa
  const Nd = 10 ** expNd
  const tau0 = 10 ** tauExp

  const { Js, Jr0, c, nLoc, drop } = useMemo(() => {
    const Js = diodeCurrents(Na, Nd, mat, 0, T).Js
    const Jr0 = logFloor(Na, Nd, mat, tau0, T)
    const c = nonIdealCurrents(Na, Nd, mat, Vj, tau0, T)
    return { Js, Jr0, c, nLoc: localN(Na, Nd, mat, Vj, tau0, T), drop: c.Jtot * rs }
  }, [Na, Nd, mat, tau0, Vj, T, rs])

  const applyPreset = (p: Preset) => {
    setTauExp(p.tauExp)
    setRs(p.rs)
    setActivePreset(p.labelHe)
  }
  const note = PRESETS.find((p) => p.labelHe === activePreset)?.noteHe

  return (
    <div className="flex flex-col gap-5">
      <Panel title="התמונה המלאה — מקדם אי-אידיאליות n">
        <p className="leading-relaxed text-slate-600">
          הנה הכול יחד. העקומה ה<b>סגולה</b> היא הדיודה הממשית; ה<b>אפורה המקווקוות</b> היא האידיאלית (<Tex>{'n=1'}</Tex>);
          וה<b>תכולה המקווקוות</b> היא המודל ההנדסי <Tex>{'J=J_S(e^{V_A/nV_T}-1)'}</Tex> עם <Tex>{'n'}</Tex> ה<b>נמדד</b>{' '}
          בנקודת העבודה — תזכורת ש-<Tex>{'n'}</Tex> אינו חוגה אלא <b>תכונה נגזרת</b> של שתי המעריכיות והברך.
        </p>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
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
                <span className="text-sm font-medium text-slate-600">חומר:</span>
                {MATERIAL_LIST.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => { setMatKey(m.key); setActivePreset(null) }}
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                      m.key === matKey ? 'border-violet-500 bg-violet-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {m.he}
                  </button>
                ))}
              </div>
              <Slider label={<>מתח-צומת · <Tex>{'V_j'}</Tex></>} value={Vj} min={0.05} max={0.7} step={0.01} onChange={setVj} display={`${Vj.toFixed(2)} V`} />
              <Slider label={<>זמן-חיים · <Tex>{'\\tau_0'}</Tex></>} value={tauExp} min={-9} max={-5} step={1} onChange={(v) => { setTauExp(v); setActivePreset(null) }} display={<Tex>{`10^{${tauExp}}\\,\\mathrm{s}`}</Tex>} />
              <Slider label={<>התנגדות טורית · <Tex>{'R_S'}</Tex></>} value={rs} min={0} max={5} step={0.1} onChange={(v) => { setRs(v); setActivePreset(null) }} display={`${rs.toFixed(1)} Ω·cm²`} />
              <Slider label={<>סימום p · <Tex>{'N_A'}</Tex></>} value={expNa} min={14} max={19} onChange={(v) => { setExpNa(v); setActivePreset(null) }} display={<Tex>{`${fmtDoping(Na)}\\,\\mathrm{cm^{-3}}`}</Tex>} />
              <Slider label={<>סימום n · <Tex>{'N_D'}</Tex></>} value={expNd} min={14} max={19} onChange={(v) => { setExpNd(v); setActivePreset(null) }} display={<Tex>{`${fmtDoping(Nd)}\\,\\mathrm{cm^{-3}}`}</Tex>} />
              <Slider label={<>טמפרטורה · <Tex>{'T'}</Tex></>} value={T} min={250} max={450} step={5} onChange={(v) => { setT(v); setActivePreset(null) }} display={`${T} K`} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Readout label="זרם רוויה $J_S$" value={fmtCurrentDensity(Js)} accent="border-rose-100 bg-rose-50" />
              <Readout label="רצפת רקומבינציה $J_{r0}$" value={fmtCurrentDensity(Jr0)} accent="border-emerald-100 bg-emerald-50" />
              <Readout label="מקדם נמדד $n$" value={nLoc.toFixed(2)} accent="border-sky-100 bg-sky-50" />
              <Readout label="מפל על $R_S$" value={fmtVolt(drop)} accent="border-violet-100 bg-violet-50" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="mb-1 text-center text-xs font-semibold text-slate-400">ממשי (סגול) · אידיאלי n=1 (אפור) · מודל הנדסי n נמדד (תכלת)</p>
              <NonIdealIVCurve Na={Na} Nd={Nd} mat={mat} Vj={Vj} tau0={tau0} rs={rs} T={T} mode="log" curves={['tot']} showIdeal showLumped n={nLoc} regions />
              <p className="mt-2 px-1 text-xs leading-relaxed text-slate-500">
                מתח-הדק בנקודת העבודה: <Tex>{'V_{term}'}</Tex> = <span dir="ltr">{fmtVolt(terminalVoltage(Vj, c.Jtot, rs))}</span>{' '}
                (מתוכו <span dir="ltr">{fmtVolt(drop)}</span> על <Tex>{'R_S'}</Tex>).
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="mb-1 text-center text-xs font-semibold text-slate-400">מקדם אי-האידיאליות הנמדד <Tex>{'n'}</Tex> לאורך המתח</p>
              <IdealityCurve Na={Na} Nd={Nd} mat={mat} tau0={tau0} rs={rs} Vj={Vj} T={T} />
              <p className="mt-2 px-1 text-xs leading-relaxed text-slate-500">
                כפונקציית מתח-הצומת <Tex>{'V_j'}</Tex>: <Tex>{'n'}</Tex> מתחיל ≈2 (רקומבינציה), צונח ל-≈1 (דיפוזיה),
                ובזרם גבוה מזנק כש-<Tex>{'R_S'}</Tex> משטח את השיפוע (<Tex>{'n'}</Tex> מדומה מתפוצץ).
              </p>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  )
}
