import { bulkOffset, neutralLevel, pinningFactor, surfaceBarrier, type Material, type Metal } from '../../../lib/junction'

/**
 * Metal–SC band diagram (n-type, equilibrium) WITH a surface-state band drawn in the
 * forbidden gap at the interface. As D_it rises the band gets denser/darker and the
 * barrier φ_B is pulled from the ideal φ_m−χ toward the pinned ⅔E_g — and E_F (bulk
 * reference) converges to the neutral level E_0 inside the interface gap. Mirrors the
 * idioms of MetalSemiconductorBandDiagram (joined phase).
 */
interface Props {
  metal: Metal
  mat: Material
  Nd: number
  Dit: number
  T?: number
}

const W = 560
const H = 300
const MX = 20
const MR = 54
const TOP = 30
const BOT = 50
const PR = W - MR
const PW = PR - MX
const PLOT_H = H - TOP - BOT
const yBot = TOP + PLOT_H
const FS = 14
const FSUB = 9
const FSR = 13
const SKY = '#0ea5e9'
const ROSE = '#f43f5e'
const VIOLET = '#7c3aed'
const AMBER = '#f59e0b'
const GLOW_C = 'drop-shadow(0 1.5px 2px rgba(14,165,233,0.28))'
const GLOW_V = 'drop-shadow(0 1.5px 2px rgba(244,63,94,0.25))'

function Defs() {
  return (
    <defs>
      <linearGradient id="ss-metal" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e2e8f0" />
        <stop offset="55%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#94a3b8" />
      </linearGradient>
      <linearGradient id="ss-gap" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f0f9ff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#fff1f2" stopOpacity="0.7" />
      </linearGradient>
      <linearGradient id="ss-dep" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#ddd6fe" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#ede9fe" stopOpacity="0.15" />
      </linearGradient>
      <linearGradient id="ss-band" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.05" />
        <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.05" />
      </linearGradient>
      <marker id="ss-cap-v" viewBox="0 0 8 8" refX="6.6" refY="4" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M1,1 L7,4 L1,7 Z" fill={VIOLET} /></marker>
      <marker id="ss-cap-a" viewBox="0 0 8 8" refX="6.6" refY="4" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M1,1 L7,4 L1,7 Z" fill={AMBER} /></marker>
      <marker id="ss-cap-g" viewBox="0 0 8 8" refX="6.6" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M1,1 L7,4 L1,7 Z" fill="#16a34a" /></marker>
    </defs>
  )
}

export default function SurfaceStatesDiagram({ metal, mat, Nd, Dit, T = 300 }: Props) {
  const eg = mat.eg
  const xJ = MX + 0.34 * PW
  const toPath = (pts: [number, number][]) => 'M ' + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L ')

  const S = pinningFactor(Dit)
  const phiB = surfaceBarrier(metal.phiM, mat.chi, eg, Dit)
  const xi = Math.max(0, bulkOffset(mat.nc, Nd, T))
  const Vbi = Math.max(phiB - xi, 0)
  const drive = Vbi // Va = 0
  const ecBulk = xi
  const ecInterface = ecBulk + drive // = φ_B
  const eTop = ecInterface + 0.4
  const eBot = ecBulk - eg - 0.35
  const eToY = (e: number) => TOP + ((eTop - e) / (eTop - eBot)) * PLOT_H

  const wFrac = Vbi > 0 ? Math.min(0.9, Math.sqrt(drive / Vbi) * 0.55) : 0
  const xW = xJ + wFrac * (PR - xJ)
  const N = 60
  const ecPts: [number, number][] = []
  const evPts: [number, number][] = []
  const eiPts: [number, number][] = []
  for (let i = 0; i <= N; i++) {
    const px = xJ + ((PR - xJ) * i) / N
    const within = px <= xW && xW > xJ
    const u = within ? (px - xJ) / (xW - xJ) : 1
    const ec = ecBulk + drive * (1 - u) * (1 - u)
    ecPts.push([px, eToY(ec)])
    evPts.push([px, eToY(ec - eg)])
    eiPts.push([px, eToY(ec - eg / 2)])
  }
  const gapFill = toPath(ecPts) + ' L ' + [...evPts].reverse().map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L ') + ' Z'

  // surface-state band, in the gap AT the interface
  const xS0 = xJ
  const xS1 = xJ + 26
  const yGapTop = eToY(ecInterface) // E_c at interface
  const yGapBot = eToY(ecInterface - eg) // E_v at interface
  const e0 = ecInterface - eg + neutralLevel(eg) // neutral level E_0 (from E_v)
  const y0 = eToY(e0)
  const nVisible = Math.round(6 + 14 * (1 - S))
  const tickOp = 0.3 + 0.55 * (1 - S)
  const ticks = Array.from({ length: nVisible }, (_, k) => {
    const yk = yGapTop + ((k + 0.5) / nVisible) * (yGapBot - yGapTop)
    return { yk, filled: yk > y0 } // below E_0 (lower energy) = filled
  })

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <Defs />
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={14} fill="#fcfcff" stroke="#eef2f7" />

        {/* depletion region */}
        {xW > xJ && <rect x={xJ} y={TOP} width={xW - xJ} height={PLOT_H} fill="url(#ss-dep)" />}
        {xW - xJ > 30 && <text x={(xJ + xW) / 2} y={TOP + 14} textAnchor="middle" className="fill-violet-500" style={{ fontSize: FSR - 1, fontWeight: 700 }}>אזור מחסור</text>}

        {/* gap fill + bands */}
        <path d={gapFill} fill="url(#ss-gap)" />

        {/* metal Fermi sea */}
        <rect x={MX} y={eToY(0)} width={xJ - MX} height={yBot - eToY(0)} fill="url(#ss-metal)" rx={3} />
        <line x1={MX} y1={eToY(0)} x2={xJ} y2={eToY(0)} stroke="#475569" strokeWidth={2.25} />
        <text x={(MX + xJ) / 2} y={yBot - 10} textAnchor="middle" className="fill-slate-700" style={{ fontSize: FSR, fontWeight: 800 }}>מתכת (M)</text>
        <line x1={xJ} y1={TOP} x2={xJ} y2={yBot} stroke="#cbd5e1" strokeWidth={1} />

        {/* surface-state band in the gap */}
        <rect x={xS0} y={yGapTop} width={xS1 - xS0} height={yGapBot - yGapTop} fill="url(#ss-band)" />
        {ticks.map((t, k) => (
          <line key={k} x1={xS0 + 3} y1={t.yk} x2={xS1 - 3} y2={t.yk} stroke={t.filled ? VIOLET : '#94a3b8'} strokeWidth={t.filled ? 2 : 1.25} opacity={t.filled ? tickOp : 0.35} />
        ))}

        {/* E_F reference */}
        <line x1={xJ} y1={eToY(0)} x2={PR} y2={eToY(0)} stroke="#0f172a" strokeWidth={1.5} strokeDasharray="6 3" />
        <text x={PR + 4} y={eToY(0) + 4} className="fill-slate-700" style={{ fontSize: FS, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: FSUB }}>F</tspan></text>

        {/* E_0 neutral level */}
        <line x1={xS0} y1={y0} x2={xS1 + 40} y2={y0} stroke="#16a34a" strokeWidth={1.5} strokeDasharray="5 3" />
        <text x={xS1 + 44} y={y0 + 4} className="fill-emerald-700" style={{ fontSize: FS - 2, fontWeight: 800 }}>E<tspan dy={3} style={{ fontSize: FSUB }}>0</tspan></text>

        {/* bands + intrinsic */}
        <path d={toPath(eiPts)} fill="none" stroke="#94a3b8" strokeWidth={1.25} strokeDasharray="3 3" />
        <path d={toPath(ecPts)} fill="none" stroke={SKY} strokeWidth={3} strokeLinejoin="round" style={{ filter: GLOW_C }} />
        <path d={toPath(evPts)} fill="none" stroke={ROSE} strokeWidth={3} strokeLinejoin="round" style={{ filter: GLOW_V }} />
        <text x={PR + 4} y={eToY(ecBulk) + 4} className="fill-sky-700" style={{ fontSize: FS, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: FSUB }}>c</tspan></text>
        <text x={PR + 4} y={eToY(ecBulk - eg) + 4} className="fill-rose-600" style={{ fontSize: FS, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: FSUB }}>v</tspan></text>
        <text x={(Math.max(xW, xJ + 30) + PR) / 2} y={yBot - 10} textAnchor="middle" className="fill-sky-700" style={{ fontSize: FSR, fontWeight: 800 }}>מל"מ-n</text>

        {/* φ_B (metal side, fixed-endpoint) */}
        <line x1={xJ + 9} y1={eToY(0)} x2={xJ + 9} y2={eToY(ecInterface)} stroke={VIOLET} strokeWidth={2.5} markerStart="url(#ss-cap-v)" markerEnd="url(#ss-cap-v)" />
        <text x={xJ + 13} y={(eToY(0) + eToY(ecInterface)) / 2} className="fill-violet-700" style={{ fontSize: FS, fontWeight: 800 }}>φ<tspan dy={3} style={{ fontSize: FSUB }}>B</tspan></text>

        {/* E_F − E_0 caliper (collapses with pinning) — just right of the SS band */}
        {Math.abs(y0 - eToY(0)) > 4 && (
          <>
            <line x1={xS1 + 8} y1={eToY(0)} x2={xS1 + 8} y2={y0} stroke="#16a34a" strokeWidth={1.5} markerStart="url(#ss-cap-g)" markerEnd="url(#ss-cap-g)" />
            <text x={xS1 + 12} y={(eToY(0) + y0) / 2 + 3} className="fill-emerald-600" style={{ fontSize: FSUB + 1, fontWeight: 700 }}>E<tspan dy={2} style={{ fontSize: FSUB - 1 }}>F</tspan><tspan dy={-2}>−E</tspan><tspan dy={2} style={{ fontSize: FSUB - 1 }}>0</tspan></text>
          </>
        )}

        {/* ψ_s band bending */}
        {drive > 0.03 && (
          <>
            <line x1={xW + 3} y1={eToY(ecBulk)} x2={xW + 3} y2={eToY(ecInterface)} stroke={AMBER} strokeWidth={1.75} markerStart="url(#ss-cap-a)" markerEnd="url(#ss-cap-a)" />
            <text x={xW + 8} y={(eToY(ecBulk) + eToY(ecInterface)) / 2} className="fill-amber-600" style={{ fontSize: FS - 2, fontWeight: 700 }}>ψ<tspan dy={3} style={{ fontSize: FSUB }}>s</tspan></text>
          </>
        )}
      </svg>
    </div>
  )
}
