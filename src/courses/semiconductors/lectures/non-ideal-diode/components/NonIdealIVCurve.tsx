import {
  builtInVoltage,
  diodeCurrents,
  logFloor,
  lumpedDiodeCurrent,
  niAt,
  nonIdealCurrents,
  terminalVoltage,
  thermalVoltage,
  type Material,
} from '../../../lib/junction'

/**
 * The non-ideal diode I–V characteristic. Unlike the ideal IVCurve (one clean
 * exponential), this overlays the physical branches and the real measured curve:
 *  • mode 'log'    — forward semilog log|J| vs V: recombination (n=2) dominates
 *    at low bias, diffusion (n=1) higher up, and the I·R_s drop bends the total
 *    curve over at high current. The y-floor is the GENERATION level J_{r0}
 *    (≫ J_S), not J_S — flooring at J_S (as the ideal curve does) would clip it.
 *  • mode 'linear' — same, on a linear axis (the R_s "resistor" bend reads clearly).
 *  • mode 'reverse'— a linear reverse-bias inset: the real |J| GROWS with |V|
 *    (generation ∝ depletion width W), versus the ideal flat −J_S.
 * The total curve is drawn PARAMETRICALLY at x = V_j + J·R_s (terminalVoltage),
 * so the high-current bend is exact with no implicit solve. `curves`/`showIdeal`/
 * `showLumped` flag which lines appear, so one component serves every tab.
 */
interface Props {
  Na: number
  Nd: number
  mat: Material
  Vj: number // operating point (junction voltage)
  tau0: number // effective SRH lifetime (s)
  rs: number // specific series resistance (Ω·cm²)
  T?: number
  mode?: 'log' | 'linear' | 'reverse'
  showIdeal?: boolean // dashed ideal n=1 Shockley overlay
  showLumped?: boolean // dashed lumped-n engineering overlay
  n?: number // ideality factor for the lumped overlay
  curves?: ('diff' | 'rec' | 'tot')[] // physical branches to draw
  regions?: boolean // annotate the n=2 / n=1 / R_s regions
  jkf?: number // high-injection knee current (A/cm²); Infinity = off
  regions4?: boolean // label all four domains: recomb / ideal / high-injection / R_s
}

const W = 460
const H = 260
const mL = 50
const mR = 16
const mT = 18
const mB = 42
const PW = W - mL - mR
const PH = H - mT - mB
const yBot = mT + PH

export default function NonIdealIVCurve({
  Na,
  Nd,
  mat,
  Vj,
  tau0,
  rs,
  T = 300,
  mode = 'log',
  showIdeal = false,
  showLumped = false,
  n = 1.5,
  curves = ['tot'],
  regions = false,
  jkf = Infinity,
  regions4 = false,
}: Props) {
  const VT = thermalVoltage(T)
  const Vbi = builtInVoltage(Na, Nd, niAt(mat, T), T)
  const Js = diodeCurrents(Na, Nd, mat, 0, T).Js

  // ---------- reverse inset (linear): |J| grows with |V| (∝ W) --------------
  if (mode === 'reverse') {
    const vRev = -5
    const NS = 80
    const data = Array.from({ length: NS + 1 }, (_, i) => {
      const v = (vRev * (NS - i)) / NS // v from vRev..0
      return { v, J: nonIdealCurrents(Na, Nd, mat, v, tau0, T).Jtot }
    })
    const jMin = Math.min(...data.map((d) => d.J)) // most negative
    const xOfR = (v: number) => mL + ((v - vRev) / (0 - vRev)) * PW
    const yOfR = (j: number) => mT + (j / jMin) * PH // 0→top, jMin→bottom
    const path = 'M ' + data.map((d) => `${xOfR(d.v).toFixed(1)},${yOfR(d.J).toFixed(1)}`).join(' L ')
    const yIdeal = yOfR(-Js) // essentially the top axis (−J_S ≪ |J_gen|)
    return (
      <div className="ltr w-full" dir="ltr">
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
          <line x1={mL} y1={mT} x2={W - mR} y2={mT} stroke="#cbd5e1" strokeWidth={1.25} />
          <line x1={W - mR} y1={mT} x2={W - mR} y2={yBot} stroke="#cbd5e1" strokeWidth={1.25} />
          <text x={mL} y={mT - 5} className="fill-slate-400" style={{ fontSize: 11 }}>0</text>
          <text x={mL - 6} y={yBot} textAnchor="end" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>−|J|</text>
          {/* ideal flat reference */}
          <line x1={mL} y1={yIdeal} x2={W - mR} y2={yIdeal} stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 4" />
          <text x={W - mR - 2} y={yIdeal + 13} textAnchor="end" className="fill-slate-400" style={{ fontSize: 10, fontWeight: 700 }}>
            אידיאלי ≈ −J<tspan dy={2} style={{ fontSize: 7 }}>S</tspan> (שטוח)
          </text>
          {/* real generation current — grows with |V| */}
          <path d={path} fill="none" stroke="#f43f5e" strokeWidth={2.75} strokeLinejoin="round" />
          <text x={mL + 6} y={yBot - 6} className="fill-rose-600" style={{ fontSize: 11, fontWeight: 700 }}>
            ממשי: זרם גנרציה ∝ W — גדל
          </text>
          <text x={mL + PW / 2} y={H - 6} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 10 }}>
            ממתח אחורי V<tspan dy={2} style={{ fontSize: 7 }}>A</tspan> (V) — הזרם אינו רווי
          </text>
        </svg>
      </div>
    )
  }

  // ---------- forward branches (log / linear) -------------------------------
  const Jref = 100 // A/cm² ceiling
  const vCapJ = Math.min(Vbi - 0.04, 1.1) // keep depletion approx. valid (W>0)
  const NS = 140
  // total (measured) curve, parametric in terminal voltage
  const tot = [] as { vt: number; J: number }[]
  let maxJ = Js
  for (let i = 0; i <= NS; i++) {
    const vj = (vCapJ * i) / NS
    const c = nonIdealCurrents(Na, Nd, mat, vj, tau0, T, jkf)
    if (c.Jtot > Jref) break
    tot.push({ vt: terminalVoltage(vj, c.Jtot, rs), J: c.Jtot })
    if (c.Jtot > maxJ) maxJ = c.Jtot
  }
  const xMax = Math.max(vCapJ, tot.length ? tot[tot.length - 1].vt : vCapJ)
  const xMin = 0
  const xOf = (v: number) => mL + ((v - xMin) / (xMax - xMin)) * PW

  const floor = logFloor(Na, Nd, mat, tau0, T)
  const yLogMin = Math.log10(floor) - 0.8
  const yLogMax = Math.log10(maxJ) + 0.3
  const yLog = (j: number) => {
    const l = Math.log10(Math.max(floor * 0.1, Math.abs(j)))
    const c = Math.max(yLogMin, Math.min(yLogMax, l))
    return yBot - ((c - yLogMin) / (yLogMax - yLogMin)) * PH
  }
  const yLin = (j: number) => yBot - (Math.max(0, Math.min(maxJ, j)) / maxJ) * PH
  const yOf = mode === 'log' ? yLog : yLin

  // build a path for a junction-voltage branch f(vj) plotted at x = vj
  const branchPath = (f: (vj: number) => number) => {
    const pts: string[] = []
    for (let i = 0; i <= NS; i++) {
      const vj = (vCapJ * i) / NS
      const val = f(vj)
      if (val <= 0) continue
      pts.push(`${xOf(vj).toFixed(1)},${yOf(val).toFixed(1)}`)
    }
    return pts.length ? 'M ' + pts.join(' L ') : ''
  }
  const totPath = 'M ' + tot.map((p) => `${xOf(p.vt).toFixed(1)},${yOf(p.J).toFixed(1)}`).join(' L ')

  const opVj = Math.max(0, Math.min(vCapJ, Vj))
  const opC = nonIdealCurrents(Na, Nd, mat, opVj, tau0, T, jkf)
  const opX = xOf(terminalVoltage(opVj, opC.Jtot, rs))
  const opY = yOf(Math.max(floor, opC.Jtot))

  // --- four-domain boundaries (terminal-voltage x), for the regions4 overlay ---
  const termX = (vj: number) => {
    const c = nonIdealCurrents(Na, Nd, mat, vj, tau0, T, jkf)
    return xOf(terminalVoltage(vj, c.Jtot, rs))
  }
  const clampV = (v: number) => Math.max(0.05, Math.min(vCapJ * 0.99, v))
  const b1 = clampV(2 * VT * Math.log(Math.max(floor, Js * 1.01) / Js)) // recombination → ideal crossover
  const b2 = Number.isFinite(jkf) ? clampV(VT * Math.log(jkf / Js)) : vCapJ // ideal → high-injection knee
  const rsHit = rs > 0 ? tot.find((p) => p.J * rs > 0.04) : undefined // R_s onset (≈40 mV drop)
  const xB1 = termX(b1)
  const xB2 = Math.max(xB1, termX(b2)) // enforce ordering — a collapsed zone just drops its label
  const xB3 = Math.max(xB2, rsHit ? xOf(rsHit.vt) : mL + PW)
  const dom = [
    { x0: mL, x1: xB1, label: 'רקומבינציה', fill: '#10b981' },
    { x0: xB1, x1: xB2, label: 'דיודה אידיאלית', fill: '#f59e0b' },
    { x0: xB2, x1: xB3, label: 'הזרקה חזקה', fill: '#0ea5e9' },
    { x0: xB3, x1: mL + PW, label: 'התנגדות טורית', fill: '#7c3aed' },
  ]

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        {/* axes */}
        <line x1={mL} y1={yBot} x2={W - mR} y2={yBot} stroke="#cbd5e1" strokeWidth={1.25} />
        <line x1={mL} y1={mT} x2={mL} y2={yBot} stroke="#cbd5e1" strokeWidth={1.25} />
        <text x={W - mR} y={yBot + 14} textAnchor="end" className="fill-slate-400" style={{ fontSize: 12 }}>
          V (קדמי)
        </text>
        <text x={mL - 6} y={mT + 8} textAnchor="end" className="fill-slate-500" style={{ fontSize: 12, fontWeight: 700 }}>
          {mode === 'log' ? 'log|J|' : 'J'}
        </text>

        {/* generation/recombination floor (log mode) */}
        {mode === 'log' && (
          <>
            <line x1={mL} y1={yLog(floor)} x2={W - mR} y2={yLog(floor)} stroke="#f43f5e" strokeWidth={1.1} strokeDasharray="4 3" opacity={0.7} />
            <text x={W - mR - 2} y={yLog(floor) - 4} textAnchor="end" className="fill-rose-400" style={{ fontSize: 9, fontWeight: 700 }}>
              רצפת רקומבינציה J<tspan dy={2} style={{ fontSize: 6 }}>r0</tspan>
            </text>
          </>
        )}

        {/* ideal n=1 dashed overlay (∝ e^{qV/kT}) */}
        {showIdeal && (
          <>
            <path d={branchPath((v) => Js * (Math.exp(v / VT) - 1))} fill="none" stroke="#94a3b8" strokeWidth={1.75} strokeDasharray="5 4" />
            {mode === 'log' && (
              <text x={xOf(VT * Math.log((maxJ * 0.012) / Js + 1)) + 4} y={yLog(maxJ * 0.012) + 14} className="fill-slate-400" style={{ fontSize: 10, fontWeight: 700 }}>
                אידיאלי ∝ exp(qV/kT)
              </text>
            )}
          </>
        )}
        {/* lumped-n dashed overlay */}
        {showLumped && (
          <path d={branchPath((v) => lumpedDiodeCurrent(Na, Nd, mat, v, n, T))} fill="none" stroke="#0ea5e9" strokeWidth={1.75} strokeDasharray="2 3" />
        )}
        {/* physical branches */}
        {curves.includes('diff') && (
          <path d={branchPath((v) => diodeCurrents(Na, Nd, mat, v, T).J)} fill="none" stroke="#f59e0b" strokeWidth={2} strokeDasharray="6 3" />
        )}
        {curves.includes('rec') && (
          <path d={branchPath((v) => nonIdealCurrents(Na, Nd, mat, v, tau0, T).Jrec)} fill="none" stroke="#10b981" strokeWidth={2} strokeDasharray="6 3" />
        )}
        {curves.includes('tot') && <path d={totPath} fill="none" stroke="#7c3aed" strokeWidth={2.75} strokeLinejoin="round" />}

        {/* region annotations (3-zone short form) */}
        {regions && !regions4 && mode === 'log' && (
          <>
            <text x={mL + PW * 0.18} y={yBot - 8} className="fill-emerald-600" style={{ fontSize: 10, fontWeight: 700 }}>שיפוע n≈2</text>
            <text x={mL + PW * 0.5} y={mT + 26} className="fill-amber-600" style={{ fontSize: 10, fontWeight: 700 }}>שיפוע n≈1</text>
            {rs > 0 && (
              <text x={mL + PW * 0.78} y={mT + 14} className="fill-violet-600" style={{ fontSize: 10, fontWeight: 700 }}>
                ברך R<tspan dy={2} style={{ fontSize: 7 }}>S</tspan>
              </text>
            )}
          </>
        )}

        {/* four labelled domains + dashed dividers (matches the lecture sketch) */}
        {regions4 && mode === 'log' && (
          <>
            {[xB1, xB2, xB3].map((x, i) =>
              x > mL + 6 && x < mL + PW - 6 ? (
                <line key={i} x1={x} y1={mT} x2={x} y2={yBot} stroke="#f43f5e" strokeWidth={1} strokeDasharray="4 4" opacity={0.45} />
              ) : null,
            )}
            {dom.map((d, i) =>
              d.x1 - d.x0 > 34 ? (
                <text key={i} x={(d.x0 + d.x1) / 2} y={mT + 11} textAnchor="middle" style={{ fontSize: 9.5, fontWeight: 700, fill: d.fill }}>
                  {d.label}
                </text>
              ) : null,
            )}
          </>
        )}

        {/* operating point (on the total curve) */}
        {curves.includes('tot') && <circle cx={opX} cy={opY} r={4} fill="#7c3aed" />}
      </svg>
    </div>
  )
}
