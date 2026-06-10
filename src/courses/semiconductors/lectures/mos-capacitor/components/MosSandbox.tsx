import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Slider from '../../../components/Slider'
import {
  MATERIALS,
  METALS,
  fermiPotential,
  mosPhiMS,
  oxideCap,
  mosDepletionWidth,
  mosDepletionCharge,
  mosMaxDepletion,
  mosThreshold,
  mosSurfacePotential,
  mosRegime,
} from '../../../lib/junction'
import Readout from './Readout'
import MosLayerSchematic from './MosLayerSchematic'
import MosBandDiagram from './MosBandDiagram'
import MosChargeProfile from './MosChargeProfile'
import { REGIME_HE, REGIME_ACCENT, type Regime } from './regime'

/**
 * The MOS "sandbox": one V_G slider (plus N_A and t_ox) drives the regime, surface potential
 * and depletion width — and the layer schematic, band diagram and charge profile all update
 * together. A V_G number-line shows where V_FB and V_T sit and which regime you're in.
 */
const SI = MATERIALS.Si
const AL = METALS.Al
const EPS_SI = SI.epsR

export default function MosSandbox() {
  const [vg, setVg] = useState(0)
  const [logNa, setLogNa] = useState(17) // log10(N_A)
  const [toxNm, setToxNm] = useState(20)

  const Na = 10 ** logNa
  const tox = toxNm * 1e-7 // cm
  const Cox = oxideCap(tox)
  const phiF = fermiPotential(Na, SI.ni)
  const VFB = mosPhiMS(AL.phiM, SI.chi, SI.eg, phiF)
  const QdMax = mosDepletionCharge(2 * phiF, Na, EPS_SI)
  const VT = mosThreshold(VFB, phiF, QdMax, Cox)

  const regime: Regime = mosRegime(vg, VFB, VT)
  const psiS = mosSurfacePotential(vg, VFB, Na, EPS_SI, Cox, phiF)
  const W = mosDepletionWidth(psiS, Na, EPS_SI)
  const Wmax = mosMaxDepletion(phiF, Na, EPS_SI)

  // continuous band-bending (px) for the diagram
  const bendPx = regime === 'accumulation' ? -Math.min(30, 12 * (VFB - vg) + 6) : Math.min(56, (psiS / (2 * phiF)) * 54)
  const wRel = Wmax > 0 ? W / Wmax : 1

  const acc = REGIME_ACCENT[regime]
  const vmin = VFB - 2.5
  const vmax = VT + 2.5
  const frac = (v: number) => Math.max(0, Math.min(1, (v - vmin) / (vmax - vmin)))

  return (
    <div className="flex flex-col gap-4">
      {/* sliders */}
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
        <Slider label={<>מתח שער · <Tex>{'V_G'}</Tex></>} value={vg} min={Number(vmin.toFixed(2))} max={Number(vmax.toFixed(2))} step={0.05} onChange={setVg} display={`${vg.toFixed(2)} V`} />
        <Slider label={<>סימום מצע · <Tex>{'N_A'}</Tex></>} value={logNa} min={15} max={18} step={0.1} onChange={setLogNa} display={`10^${logNa.toFixed(1)} cm⁻³`} />
        <Slider label={<>עובי אוקסיד · <Tex>{'t_{ox}'}</Tex></>} value={toxNm} min={3} max={60} step={1} onChange={setToxNm} display={`${toxNm} nm`} />
      </div>

      {/* V_G number line with regime zones */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="ltr w-full" dir="ltr">
          <svg viewBox="0 0 600 70" className="w-full">
            <rect x={20} y={20} width={(frac(VFB)) * 560} height={16} fill="#fecdd3" />
            <rect x={20 + frac(VFB) * 560} y={20} width={(frac(VT) - frac(VFB)) * 560} height={16} fill="#fde68a" />
            <rect x={20 + frac(VT) * 560} y={20} width={(1 - frac(VT)) * 560} height={16} fill="#a7f3d0" />
            <text x={20 + frac(VFB) * 560 / 2} y={50} textAnchor="middle" className="fill-rose-600" style={{ fontSize: 11, fontWeight: 700 }}>הצטברות</text>
            <text x={20 + (frac(VFB) + frac(VT)) / 2 * 560} y={50} textAnchor="middle" className="fill-amber-600" style={{ fontSize: 11, fontWeight: 700 }}>דלדול</text>
            <text x={20 + (frac(VT) + 1) / 2 * 560} y={50} textAnchor="middle" className="fill-emerald-600" style={{ fontSize: 11, fontWeight: 700 }}>היפוך</text>
            {/* V_FB / V_T ticks */}
            <line x1={20 + frac(VFB) * 560} y1={14} x2={20 + frac(VFB) * 560} y2={40} stroke="#64748b" strokeWidth={1.25} />
            <text x={20 + frac(VFB) * 560} y={11} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 9.5, fontWeight: 700 }}>V<tspan dy={2} style={{ fontSize: 7 }}>FB</tspan></text>
            <line x1={20 + frac(VT) * 560} y1={14} x2={20 + frac(VT) * 560} y2={40} stroke="#64748b" strokeWidth={1.25} />
            <text x={20 + frac(VT) * 560} y={11} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 9.5, fontWeight: 700 }}>V<tspan dy={2} style={{ fontSize: 7 }}>T</tspan></text>
            {/* current V_G marker */}
            <circle cx={20 + frac(vg) * 560} cy={28} r={7} fill="#1e293b" stroke="#fff" strokeWidth={2} />
          </svg>
        </div>
      </div>

      {/* regime badge */}
      <div className={`rounded-2xl border-s-4 px-4 py-2.5 text-center text-base font-extrabold ${acc.border} ${acc.bg} ${acc.text}`}>
        משטר: {REGIME_HE[regime]}
      </div>

      {/* three synchronized views */}
      <div className="grid gap-3 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-2">
          <p className="mb-1 text-center text-xs font-semibold text-slate-500">סכמת השכבות</p>
          <MosLayerSchematic regime={regime} />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-2">
          <p className="mb-1 text-center text-xs font-semibold text-slate-500">דיאגרמת פסים</p>
          <MosBandDiagram regime={regime} bendPx={bendPx} />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-2">
          <p className="mb-1 text-center text-xs font-semibold text-slate-500">צפיפות המטען <Tex>{'\\rho(x)'}</Tex></p>
          <MosChargeProfile regime={regime} wRel={wRel} />
        </div>
      </div>

      {/* readouts */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        <Readout label="מתח flat-band $V_{FB}$" value={`${VFB.toFixed(2)} V`} accent="border-rose-100 bg-rose-50" />
        <Readout label="מתח-סף $V_T$" value={`${VT.toFixed(2)} V`} accent="border-emerald-100 bg-emerald-50" />
        <Readout label="פוטנציאל-שטח $\\psi_s$" value={`${psiS.toFixed(3)} V`} accent="border-amber-100 bg-amber-50" />
        <Readout label="רוחב דלדול $W$" value={`${(W * 1e7).toFixed(0)} nm`} accent="border-sky-100 bg-sky-50" />
        <Readout label="פרמי $\\phi_F$" value={`${phiF.toFixed(3)} V`} accent="border-violet-100 bg-violet-50" />
      </div>
    </div>
  )
}
