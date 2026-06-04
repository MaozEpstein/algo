import { schottkyBarrier, bulkOffset, type Material, type Metal } from '../../../lib/junction'

/**
 * The metal–semiconductor (n-type) energy-band diagram — the heart of the
 * Schottky lecture. Two phases:
 *  • 'separated' — before contact, vacuum levels aligned. φ_m, φ_s and χ are drawn
 *    as drops from the vacuum level; the metal Fermi level sits below the
 *    semiconductor's (φ_m > φ_s) — the misalignment that drives the barrier.
 *  • 'joined' — after contact: the Fermi levels equalize (E_F=0 reference), the
 *    bands bend up forming the barrier, and a one-sided depletion region opens.
 *    Under bias the SC-side bending q(V_bi−V_A) changes while φ_B stays fixed.
 * Aesthetic layer: a metallic gradient Fermi sea, a shaded forbidden gap between
 * E_c and E_v, soft glow on the band edges, and a graded depletion region.
 */
interface Props {
  metal: Metal
  mat: Material
  Nd: number
  Va: number
  phase: 'separated' | 'joined'
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
const SLATE = '#94a3b8'
const VIOLET = '#7c3aed'
const AMBER = '#f59e0b'
const GLOW_C = 'drop-shadow(0 1.5px 2px rgba(14,165,233,0.28))'
const GLOW_V = 'drop-shadow(0 1.5px 2px rgba(244,63,94,0.25))'

function Defs() {
  return (
    <defs>
      <linearGradient id="ms-metal" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e2e8f0" />
        <stop offset="55%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#94a3b8" />
      </linearGradient>
      <linearGradient id="ms-dep" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#ddd6fe" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#ede9fe" stopOpacity="0.15" />
      </linearGradient>
      <linearGradient id="ms-gap" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f0f9ff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#fff1f2" stopOpacity="0.7" />
      </linearGradient>
      {/* double-headed dimension arrowheads (auto-start-reverse → both ends point outward) */}
      <marker id="ms-cap" viewBox="0 0 8 8" refX="6.6" refY="4" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M1,1 L7,4 L1,7 Z" fill="#475569" /></marker>
      <marker id="ms-cap-s" viewBox="0 0 8 8" refX="6.6" refY="4" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M1,1 L7,4 L1,7 Z" fill="#0369a1" /></marker>
      <marker id="ms-cap-a" viewBox="0 0 8 8" refX="6.6" refY="4" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M1,1 L7,4 L1,7 Z" fill={AMBER} /></marker>
      <marker id="ms-cap-v" viewBox="0 0 8 8" refX="6.6" refY="4" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M1,1 L7,4 L1,7 Z" fill={VIOLET} /></marker>
      <marker id="ms-cap-g" viewBox="0 0 8 8" refX="6.6" refY="4" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M1,1 L7,4 L1,7 Z" fill="#16a34a" /></marker>
    </defs>
  )
}

export default function MetalSemiconductorBandDiagram({ metal, mat, Nd, Va, phase, T = 300 }: Props) {
  const phiB = schottkyBarrier(metal.phiM, mat.chi)
  const xi = Math.max(0, bulkOffset(mat.nc, Nd, T))
  const Vbi = phiB - xi
  const eg = mat.eg
  const xJ = MX + 0.34 * PW

  if (phase === 'separated') {
    const eTop = 0.6
    const eFm = -metal.phiM
    const ec = -mat.chi
    const ef = -mat.chi - xi
    const ev = -mat.chi - eg
    const eBot = Math.min(eFm, ev) - 0.5
    const eToY = (e: number) => TOP + ((eTop - e) / (eTop - eBot)) * PLOT_H
    const gap = 18
    const scL = xJ + gap
    return (
      <div className="ltr w-full" dir="ltr">
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
          <Defs />
          <rect x={2} y={2} width={W - 4} height={H - 4} rx={14} fill="#fcfcff" stroke="#eef2f7" />

          {/* vacuum level */}
          <line x1={MX} y1={eToY(0)} x2={PR} y2={eToY(0)} stroke={SLATE} strokeWidth={1.75} strokeDasharray="7 4" />
          <text x={PR + 4} y={eToY(0) + 4} className="fill-slate-500" style={{ fontSize: FS, fontWeight: 700 }}>E₀</text>
          <text x={(MX + PR) / 2} y={eToY(0) - 8} textAnchor="middle" className="fill-slate-400" style={{ fontSize: FSR, fontWeight: 700 }}>רמת ואקום</text>

          {/* metal Fermi sea */}
          <rect x={MX} y={eToY(eFm)} width={xJ - MX} height={yBot - eToY(eFm)} fill="url(#ms-metal)" rx={3} />
          <line x1={MX} y1={eToY(eFm)} x2={xJ} y2={eToY(eFm)} stroke="#475569" strokeWidth={2.25} />
          <text x={(MX + xJ) / 2} y={yBot - 10} textAnchor="middle" className="fill-slate-700" style={{ fontSize: FSR, fontWeight: 800 }}>מתכת ({metal.key})</text>
          <text x={MX + 5} y={eToY(eFm) - 6} className="fill-slate-700" style={{ fontSize: FS, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: FSUB }}>Fm</tspan></text>
          {/* φ_m */}
          <line x1={MX + 34} y1={eToY(0)} x2={MX + 34} y2={eToY(eFm)} stroke="#475569" strokeWidth={1.75} markerStart="url(#ms-cap)" markerEnd="url(#ms-cap)" />
          <text x={MX + 39} y={(eToY(0) + eToY(eFm)) / 2} className="fill-slate-700" style={{ fontSize: FS, fontWeight: 800 }}>φ<tspan dy={3} style={{ fontSize: FSUB }}>m</tspan></text>

          {/* forbidden-gap shading */}
          <rect x={scL} y={eToY(ec)} width={PR - scL} height={eToY(ev) - eToY(ec)} fill="url(#ms-gap)" />
          <text x={PR - 8} y={(eToY(ec) + eToY(ev)) / 2 + 4} textAnchor="end" className="fill-slate-300" style={{ fontSize: FSUB + 1, fontWeight: 700 }}>פס אסור</text>

          {/* semiconductor flat bands */}
          <line x1={scL} y1={eToY(ec)} x2={PR} y2={eToY(ec)} stroke={SKY} strokeWidth={3} style={{ filter: GLOW_C }} />
          <line x1={scL} y1={eToY(ev)} x2={PR} y2={eToY(ev)} stroke={ROSE} strokeWidth={3} style={{ filter: GLOW_V }} />
          <line x1={scL} y1={eToY(ef)} x2={PR} y2={eToY(ef)} stroke="#0f172a" strokeWidth={1.5} strokeDasharray="6 3" />
          <text x={PR + 4} y={eToY(ec) - 3} className="fill-sky-700" style={{ fontSize: FS, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: FSUB }}>c</tspan></text>
          <text x={PR + 4} y={eToY(ev) + 5} className="fill-rose-600" style={{ fontSize: FS, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: FSUB }}>v</tspan></text>
          <text x={PR + 4} y={eToY(ef) + 13} className="fill-slate-700" style={{ fontSize: FS, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: FSUB }}>F</tspan></text>
          <text x={(scL + PR) / 2} y={yBot - 10} textAnchor="middle" className="fill-sky-700" style={{ fontSize: FSR, fontWeight: 800 }}>מל"מ-n ({mat.key})</text>
          {/* χ (vacuum → E_c) */}
          <line x1={scL + 30} y1={eToY(0)} x2={scL + 30} y2={eToY(ec)} stroke="#0369a1" strokeWidth={1.75} markerStart="url(#ms-cap-s)" markerEnd="url(#ms-cap-s)" />
          <text x={scL + 35} y={(eToY(0) + eToY(ec)) / 2} className="fill-sky-700" style={{ fontSize: FS, fontWeight: 800 }}>χ</text>
          {/* φ_s (vacuum → E_F) — drawn beside χ so φ_m vs φ_s is visible */}
          <line x1={scL + 78} y1={eToY(0)} x2={scL + 78} y2={eToY(ef)} stroke="#0369a1" strokeWidth={1.75} markerStart="url(#ms-cap-s)" markerEnd="url(#ms-cap-s)" />
          <text x={scL + 83} y={(eToY(0) + eToY(ef)) / 2} className="fill-sky-700" style={{ fontSize: FS, fontWeight: 800 }}>φ<tspan dy={3} style={{ fontSize: FSUB }}>s</tspan></text>

          {/* Fermi misalignment qV_bi */}
          <line x1={xJ + gap / 2} y1={eToY(eFm)} x2={xJ + gap / 2} y2={eToY(ef)} stroke={AMBER} strokeWidth={2.25} markerStart="url(#ms-cap-a)" markerEnd="url(#ms-cap-a)" />
          <text x={xJ + gap / 2 + 5} y={(eToY(eFm) + eToY(ef)) / 2} className="fill-amber-600" style={{ fontSize: FS - 2, fontWeight: 700 }}>qV<tspan dy={3} style={{ fontSize: FSUB }}>bi</tspan></text>
        </svg>
      </div>
    )
  }

  // ---- joined ----
  const drive = Math.max(Vbi - Va, 0)
  const ecBulk = xi
  const ecInterface = xi + drive
  const eFm = -Va
  const eTop = ecInterface + 0.4
  const eBot = ecBulk - eg - 0.35
  const eToY = (e: number) => TOP + ((eTop - e) / (eTop - eBot)) * PLOT_H

  const Vbi0 = Vbi
  const wFrac = Vbi0 > 0 ? Math.min(0.9, Math.sqrt(Math.max(drive, 0) / Vbi0) * 0.55) : 0
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
  const toPath = (pts: [number, number][]) => 'M ' + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L ')
  const gapFill = toPath(ecPts) + ' L ' + [...evPts].reverse().map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L ') + ' Z'

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <Defs />
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={14} fill="#fcfcff" stroke="#eef2f7" />

        {/* depletion region (graded) */}
        {xW > xJ && <rect x={xJ} y={TOP} width={xW - xJ} height={PLOT_H} fill="url(#ms-dep)" />}
        {xW - xJ > 30 && (
          <text x={(xJ + xW) / 2} y={TOP + 14} textAnchor="middle" className="fill-violet-500" style={{ fontSize: FSR - 1, fontWeight: 700 }}>אזור מחסור</text>
        )}

        {/* forbidden gap fill between E_c and E_v */}
        <path d={gapFill} fill="url(#ms-gap)" />

        {/* metal Fermi sea */}
        <rect x={MX} y={eToY(eFm)} width={xJ - MX} height={yBot - eToY(eFm)} fill="url(#ms-metal)" rx={3} />
        <line x1={MX} y1={eToY(eFm)} x2={xJ} y2={eToY(eFm)} stroke="#475569" strokeWidth={2.25} />
        <text x={(MX + xJ) / 2} y={yBot - 10} textAnchor="middle" className="fill-slate-700" style={{ fontSize: FSR, fontWeight: 800 }}>מתכת ({metal.key})</text>

        {/* interface */}
        <line x1={xJ} y1={TOP} x2={xJ} y2={yBot} stroke="#cbd5e1" strokeWidth={1} />

        {/* E_F reference */}
        <line x1={xJ} y1={eToY(0)} x2={PR} y2={eToY(0)} stroke="#0f172a" strokeWidth={1.5} strokeDasharray="6 3" />
        <text x={PR + 4} y={eToY(0) + 4} className="fill-slate-700" style={{ fontSize: FS, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: FSUB }}>F</tspan></text>

        {/* bands with glow + intrinsic level (dashed) */}
        <path d={toPath(eiPts)} fill="none" stroke="#94a3b8" strokeWidth={1.25} strokeDasharray="3 3" />
        <path d={toPath(ecPts)} fill="none" stroke={SKY} strokeWidth={3} strokeLinejoin="round" style={{ filter: GLOW_C }} />
        <path d={toPath(evPts)} fill="none" stroke={ROSE} strokeWidth={3} strokeLinejoin="round" style={{ filter: GLOW_V }} />
        <text x={PR + 4} y={eToY(ecBulk) + 4} className="fill-sky-700" style={{ fontSize: FS, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: FSUB }}>c</tspan></text>
        <text x={PR + 4} y={eToY(ecBulk - eg / 2) + 4} className="fill-slate-400" style={{ fontSize: FS, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: FSUB }}>i</tspan></text>
        <text x={PR + 4} y={eToY(ecBulk - eg) + 4} className="fill-rose-600" style={{ fontSize: FS, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: FSUB }}>v</tspan></text>

        {/* φ_B (fixed, metal side) */}
        <line x1={xJ + 9} y1={eToY(eFm)} x2={xJ + 9} y2={eToY(ecInterface)} stroke={VIOLET} strokeWidth={2.5} markerStart="url(#ms-cap-v)" markerEnd="url(#ms-cap-v)" />
        <text x={xJ + 14} y={(eToY(eFm) + eToY(ecInterface)) / 2} className="fill-violet-700" style={{ fontSize: FS, fontWeight: 800 }}>φ<tspan dy={3} style={{ fontSize: FSUB }}>B</tspan></text>

        {/* q(V_bi−V_A) bending */}
        {drive > 0.02 && (
          <>
            <line x1={xW + 3} y1={eToY(ecBulk)} x2={xW + 3} y2={eToY(ecInterface)} stroke={AMBER} strokeWidth={1.75} markerStart="url(#ms-cap-a)" markerEnd="url(#ms-cap-a)" />
            <text x={xW + 8} y={(eToY(ecBulk) + eToY(ecInterface)) / 2} className="fill-amber-600" style={{ fontSize: FS - 2, fontWeight: 700 }}>q(V<tspan dy={3} style={{ fontSize: FSUB }}>bi</tspan><tspan dy={-3}>−V</tspan><tspan dy={3} style={{ fontSize: FSUB }}>A</tspan><tspan dy={-3}>)</tspan></text>
          </>
        )}

        {/* qV_A split */}
        {Math.abs(Va) > 0.02 && (
          <>
            <line x1={xJ - 18} y1={eToY(0)} x2={xJ - 18} y2={eToY(eFm)} stroke="#16a34a" strokeWidth={1.75} markerStart="url(#ms-cap-g)" markerEnd="url(#ms-cap-g)" />
            <text x={xJ - 16} y={(eToY(0) + eToY(eFm)) / 2 + 3} className="fill-emerald-600" style={{ fontSize: FS - 2, fontWeight: 700 }}>qV<tspan dy={3} style={{ fontSize: FSUB }}>A</tspan></text>
          </>
        )}

        {/* neutral-bulk region label */}
        <text x={(Math.max(xW, xJ + 30) + PR) / 2} y={yBot - 10} textAnchor="middle" className="fill-sky-700" style={{ fontSize: FSR, fontWeight: 800 }}>מל"מ-n · בולק</text>
      </svg>
    </div>
  )
}
