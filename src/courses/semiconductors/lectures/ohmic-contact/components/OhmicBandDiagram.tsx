import { schottkyBarrier, bulkOffset, schottkyWidth, type Material, type Metal } from '../../../lib/junction'

/**
 * Metal–semiconductor OHMIC-contact band diagram (n-type, equilibrium). Two modes:
 *  • 'accumulation' — the ideal route (φ_m < φ_s): E_c bends DOWN toward the
 *    interface (below E_F), no barrier, an electron accumulation layer → free,
 *    two-way flow. Drawn schematically (real metals on Si rarely reach this).
 *  • 'tunneling' — the practical route: a Schottky barrier remains, but heavy n⁺
 *    doping makes the depletion barrier so THIN that electrons tunnel through it
 *    (horizontal arrow at E_F, through the barrier). Driven by the real N_D.
 * Clones the visual idioms (Fermi-sea gradient, gap fill, double-headed dimension
 * arrows, glow) of MetalSemiconductorBandDiagram.
 */
interface Props {
  metal: Metal
  mat: Material
  Nd: number
  mode: 'accumulation' | 'tunneling'
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
const EMERALD = '#10b981'
const AMBER = '#f59e0b'
const GLOW_C = 'drop-shadow(0 1.5px 2px rgba(14,165,233,0.28))'
const GLOW_V = 'drop-shadow(0 1.5px 2px rgba(244,63,94,0.25))'

function Defs() {
  return (
    <defs>
      <linearGradient id="oh-metal" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e2e8f0" />
        <stop offset="55%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#94a3b8" />
      </linearGradient>
      <linearGradient id="oh-gap" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f0f9ff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#fff1f2" stopOpacity="0.7" />
      </linearGradient>
      <linearGradient id="oh-acc" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#34d399" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0.05" />
      </linearGradient>
      {/* double-headed dimension arrow (outward) + single-headed tunneling/flow arrows */}
      <marker id="oh-cap-e" viewBox="0 0 8 8" refX="6.6" refY="4" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M1,1 L7,4 L1,7 Z" fill={EMERALD} /></marker>
      <marker id="oh-tip-v" viewBox="0 0 8 8" refX="6.6" refY="4" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M1,1 L7,4 L1,7 Z" fill={VIOLET} /></marker>
      <marker id="oh-tip-e" viewBox="0 0 8 8" refX="6.6" refY="4" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M1,1 L7,4 L1,7 Z" fill={EMERALD} /></marker>
      <marker id="oh-tip-tun" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="9" markerHeight="9" orient="auto"><path d="M1,1.5 L10.5,6 L1,10.5 Z" fill={AMBER} /></marker>
    </defs>
  )
}

export default function OhmicBandDiagram({ metal, mat, Nd, mode, T = 300 }: Props) {
  const eg = mat.eg
  const xJ = MX + 0.34 * PW
  const toPath = (pts: [number, number][]) => 'M ' + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L ')

  if (mode === 'accumulation') {
    // schematic: E_c (bulk, above E_F) bends DOWN below E_F at the interface
    const ecBulk = 0.28
    const ecIface = -0.16
    const eTop = 0.5
    const eBot = ecBulk - eg - 0.3
    const eToY = (e: number) => TOP + ((eTop - e) / (eTop - eBot)) * PLOT_H
    const xAcc = xJ + 0.42 * (PR - xJ) // accumulation-bend length
    const N = 60
    const ecPts: [number, number][] = []
    const evPts: [number, number][] = []
    const eiPts: [number, number][] = []
    for (let i = 0; i <= N; i++) {
      const px = xJ + ((PR - xJ) * i) / N
      const u = px <= xAcc ? (px - xJ) / (xAcc - xJ) : 1 // 0 at interface, 1 at bulk
      const ec = ecBulk + (ecIface - ecBulk) * (1 - u) * (1 - u)
      ecPts.push([px, eToY(ec)])
      evPts.push([px, eToY(ec - eg)])
      eiPts.push([px, eToY(ec - eg / 2)])
    }
    const gapFill = toPath(ecPts) + ' L ' + [...evPts].reverse().map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L ') + ' Z'
    return (
      <div className="ltr w-full" dir="ltr">
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
          <Defs />
          <rect x={2} y={2} width={W - 4} height={H - 4} rx={14} fill="#fcfcff" stroke="#eef2f7" />
          {/* accumulation layer (electrons pile up where E_c dips below E_F) */}
          <rect x={xJ} y={eToY(0)} width={xAcc - xJ} height={yBot - eToY(0)} fill="url(#oh-acc)" />
          <text x={(xJ + xAcc) / 2} y={yBot - 9} textAnchor="middle" className="fill-emerald-600" style={{ fontSize: FSR - 1, fontWeight: 700 }}>שכבת צבירה</text>
          {/* gap fill */}
          <path d={gapFill} fill="url(#oh-gap)" />
          {/* metal Fermi sea up to E_F (aligned) */}
          <rect x={MX} y={eToY(0)} width={xJ - MX} height={yBot - eToY(0)} fill="url(#oh-metal)" rx={3} />
          <line x1={MX} y1={eToY(0)} x2={xJ} y2={eToY(0)} stroke="#475569" strokeWidth={2.25} />
          <text x={(MX + xJ) / 2} y={yBot - 9} textAnchor="middle" className="fill-slate-700" style={{ fontSize: FSR, fontWeight: 800 }}>מתכת</text>
          <line x1={xJ} y1={TOP} x2={xJ} y2={yBot} stroke="#cbd5e1" strokeWidth={1} />
          {/* E_F reference */}
          <line x1={MX} y1={eToY(0)} x2={PR} y2={eToY(0)} stroke="#0f172a" strokeWidth={1.5} strokeDasharray="6 3" />
          <text x={PR + 4} y={eToY(0) + 4} className="fill-slate-700" style={{ fontSize: FS, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: FSUB }}>F</tspan></text>
          {/* bands */}
          <path d={toPath(eiPts)} fill="none" stroke="#94a3b8" strokeWidth={1.25} strokeDasharray="3 3" />
          <path d={toPath(ecPts)} fill="none" stroke={SKY} strokeWidth={3} strokeLinejoin="round" style={{ filter: GLOW_C }} />
          <path d={toPath(evPts)} fill="none" stroke={ROSE} strokeWidth={3} strokeLinejoin="round" style={{ filter: GLOW_V }} />
          <text x={PR + 4} y={eToY(ecBulk) + 4} className="fill-sky-700" style={{ fontSize: FS, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: FSUB }}>c</tspan></text>
          <text x={PR + 4} y={eToY(ecBulk - eg) + 4} className="fill-rose-600" style={{ fontSize: FS, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: FSUB }}>v</tspan></text>
          <text x={(xAcc + PR) / 2} y={yBot - 9} textAnchor="middle" className="fill-sky-700" style={{ fontSize: FSR, fontWeight: 800 }}>מל"מ-n</text>
          {/* free two-way flow (no barrier) */}
          <line x1={xJ - 26} y1={eToY(0) - 16} x2={xJ + 40} y2={eToY(0) - 16} stroke={EMERALD} strokeWidth={2.25} markerStart="url(#oh-tip-e)" markerEnd="url(#oh-tip-e)" />
          <text x={xJ + 46} y={eToY(0) - 12} className="fill-emerald-600" style={{ fontSize: FS - 2, fontWeight: 700 }}>זרימה חופשית — אין מחסום</text>
        </svg>
      </div>
    )
  }

  // ---- tunneling: thin Schottky barrier, heavy n⁺ doping ----
  const phiB = schottkyBarrier(metal.phiM, mat.chi)
  const xi = bulkOffset(mat.nc, Nd, T) // <0 when degenerate (n⁺) → E_c below E_F
  const Vbi = phiB - xi
  const Wcm = schottkyWidth(mat, Nd, 0, Vbi)
  const eTop = phiB + 0.32
  const eBot = Math.min(xi, 0) - eg - 0.3
  const eToY = (e: number) => TOP + ((eTop - e) / (eTop - eBot)) * PLOT_H
  // map the (very thin) physical depletion width to a visible fraction of the SC pane
  const wFrac = Math.min(0.5, Math.max(0.06, (Wcm / 2e-6) * 0.5)) // ~2nm → mid; thinner → narrower
  const xW = xJ + wFrac * (PR - xJ)
  const N = 60
  const ecPts: [number, number][] = []
  const evPts: [number, number][] = []
  for (let i = 0; i <= N; i++) {
    const px = xJ + ((PR - xJ) * i) / N
    const u = px <= xW ? (px - xJ) / (xW - xJ) : 1
    const ec = xi + Vbi * (1 - u) * (1 - u) // φ_B at interface (u=0) → xi in bulk
    ecPts.push([px, eToY(ec)])
    evPts.push([px, eToY(ec - eg)])
  }
  const gapFill = toPath(ecPts) + ' L ' + [...evPts].reverse().map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L ') + ' Z'
  // where the bent E_c crosses E_F (=0): the tunnel exit into the conduction band
  let xCross = xW
  for (let i = 0; i <= N; i++) {
    const px = xJ + ((PR - xJ) * i) / N
    const u = px <= xW ? (px - xJ) / (xW - xJ) : 1
    if (xi + Vbi * (1 - u) * (1 - u) <= 0) { xCross = px; break }
  }

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <Defs />
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={14} fill="#fcfcff" stroke="#eef2f7" />
        {/* thin depletion barrier shading */}
        <rect x={xJ} y={TOP} width={xW - xJ} height={PLOT_H} fill="#ede9fe" opacity={0.55} />
        <text x={(xJ + xW) / 2} y={TOP + 13} textAnchor="middle" className="fill-violet-500" style={{ fontSize: FSUB + 1, fontWeight: 700 }}>מחסום דק</text>
        <path d={gapFill} fill="url(#oh-gap)" />
        {/* metal Fermi sea up to E_F */}
        <rect x={MX} y={eToY(0)} width={xJ - MX} height={yBot - eToY(0)} fill="url(#oh-metal)" rx={3} />
        <line x1={MX} y1={eToY(0)} x2={xJ} y2={eToY(0)} stroke="#475569" strokeWidth={2.25} />
        <text x={(MX + xJ) / 2} y={yBot - 9} textAnchor="middle" className="fill-slate-700" style={{ fontSize: FSR, fontWeight: 800 }}>מתכת</text>
        <line x1={xJ} y1={TOP} x2={xJ} y2={yBot} stroke="#cbd5e1" strokeWidth={1} />
        {/* E_F */}
        <line x1={MX} y1={eToY(0)} x2={PR} y2={eToY(0)} stroke="#0f172a" strokeWidth={1.5} strokeDasharray="6 3" />
        <text x={PR + 4} y={eToY(0) + 4} className="fill-slate-700" style={{ fontSize: FS, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: FSUB }}>F</tspan></text>
        {/* bands */}
        <path d={toPath(ecPts)} fill="none" stroke={SKY} strokeWidth={3} strokeLinejoin="round" style={{ filter: GLOW_C }} />
        <path d={toPath(evPts)} fill="none" stroke={ROSE} strokeWidth={3} strokeLinejoin="round" style={{ filter: GLOW_V }} />
        <text x={PR + 4} y={eToY(xi) + 4} className="fill-sky-700" style={{ fontSize: FS, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: FSUB }}>c</tspan></text>
        <text x={PR + 4} y={eToY(xi - eg) + 4} className="fill-rose-600" style={{ fontSize: FS, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: FSUB }}>v</tspan></text>
        {/* φ_B dimension (fixed, metal side) */}
        <line x1={xJ + 8} y1={eToY(0)} x2={xJ + 8} y2={eToY(phiB)} stroke={VIOLET} strokeWidth={2} markerStart="url(#oh-tip-v)" markerEnd="url(#oh-tip-v)" />
        <text x={xJ + 12} y={eToY(phiB) + 12} className="fill-violet-700" style={{ fontSize: FS, fontWeight: 800 }}>φ<tspan dy={3} style={{ fontSize: FSUB }}>B</tspan></text>
        {/* horizontal tunneling arrow at E_F — emphasised: amber, solid, glowing, offset
            7px above the black E_F dashed line, riding a tinted "tunnel channel" through
            the thin barrier into the conduction band at xCross */}
        {(() => {
          const yTun = eToY(0) - 7
          return (
            <g>
              <rect x={xJ} y={yTun - 7} width={Math.max(8, xCross - xJ)} height={14} rx={3} fill={AMBER} opacity={0.18} />
              <line x1={xJ - 26} y1={eToY(0)} x2={xJ - 26} y2={yTun} stroke={AMBER} strokeWidth={1.5} />
              <line x1={xJ - 26} y1={yTun} x2={xCross + 12} y2={yTun} stroke={AMBER} strokeWidth={3} strokeLinecap="round" markerEnd="url(#oh-tip-tun)" style={{ filter: 'drop-shadow(0 0 2px rgba(245,158,11,0.55))' }} />
              <text x={xCross + 16} y={yTun - 5} className="fill-amber-700" style={{ fontSize: FS, fontWeight: 900 }}>מנהור</text>
            </g>
          )
        })()}
        {/* heavy-doping label */}
        <text x={(Math.max(xW, xJ + 30) + PR) / 2} y={yBot - 9} textAnchor="middle" className="fill-sky-700" style={{ fontSize: FSR, fontWeight: 800 }}>מל"מ n⁺ (סימום כבד)</text>
      </svg>
    </div>
  )
}
