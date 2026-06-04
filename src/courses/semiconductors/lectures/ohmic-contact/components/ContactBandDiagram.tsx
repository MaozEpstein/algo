import { contactKind, type CarrierType } from '../../../lib/junction'

/**
 * GENERAL metal–semiconductor band diagram covering ALL FOUR fundamental cases
 * (n/p × rectifying/ohmic) plus forward/reverse bias. Metal on the LEFT, SC on the
 * RIGHT. One geometry engine; the four cases differ only in three booleans
 * (rectifying, bendUp, type) and a sign — so the draw code branches in just three
 * small places (shading, barrier marker, accumulation side).
 *
 * Physics (φ_s = χ + (E_c−E_F)):
 *  • band-bending direction = sign(φ_m − φ_s), independent of type (UP if φ_m>φ_s);
 *  • n rectifies when φ_m>φ_s (electron depletion, φ_Bn=φ_m−χ);
 *  • p rectifies when φ_m<φ_s (hole depletion, φ_Bp=χ+E_g−φ_m);
 *  • otherwise ohmic (majority accumulation, no barrier);
 *  • V_eff = (n? +V_A : −V_A); forward shrinks q(V_bi−V_A); φ_B is bias-independent.
 * Mirrors the visual idioms of MetalSemiconductorBandDiagram.
 */
interface Props {
  type: CarrierType
  phiM: number
  chi: number
  eg: number
  /** semiconductor work function φ_s = χ + (E_c − E_F). */
  phiS: number
  Va: number
  /** 'separated' = before contact (vacuum levels aligned); 'joined' = after contact (default). */
  phase?: 'separated' | 'joined'
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
const EMERALD = '#10b981'
const SLATE = '#94a3b8'
const GLOW_C = 'drop-shadow(0 1.5px 2px rgba(14,165,233,0.28))'
const GLOW_V = 'drop-shadow(0 1.5px 2px rgba(244,63,94,0.25))'
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

function Defs() {
  return (
    <defs>
      <linearGradient id="cbd-metal" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e2e8f0" />
        <stop offset="55%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#94a3b8" />
      </linearGradient>
      <linearGradient id="cbd-gap" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f0f9ff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#fff1f2" stopOpacity="0.7" />
      </linearGradient>
      <linearGradient id="cbd-dep" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#ddd6fe" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#ede9fe" stopOpacity="0.15" />
      </linearGradient>
      <linearGradient id="cbd-acc-n" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#34d399" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0.05" />
      </linearGradient>
      <linearGradient id="cbd-acc-p" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#fb7185" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#fecdd3" stopOpacity="0.05" />
      </linearGradient>
      {/* double-headed dimension arrowheads (outward) + single-headed flow tips */}
      <marker id="cbd-cap-v" viewBox="0 0 8 8" refX="6.6" refY="4" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M1,1 L7,4 L1,7 Z" fill={VIOLET} /></marker>
      <marker id="cbd-cap-r" viewBox="0 0 8 8" refX="6.6" refY="4" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M1,1 L7,4 L1,7 Z" fill={ROSE} /></marker>
      <marker id="cbd-cap-a" viewBox="0 0 8 8" refX="6.6" refY="4" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M1,1 L7,4 L1,7 Z" fill={AMBER} /></marker>
      <marker id="cbd-cap-g" viewBox="0 0 8 8" refX="6.6" refY="4" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M1,1 L7,4 L1,7 Z" fill="#16a34a" /></marker>
      <marker id="cbd-tip-e" viewBox="0 0 8 8" refX="6.6" refY="4" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M1,1 L7,4 L1,7 Z" fill={EMERALD} /></marker>
      <marker id="cbd-cap" viewBox="0 0 8 8" refX="6.6" refY="4" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M1,1 L7,4 L1,7 Z" fill="#475569" /></marker>
      <marker id="cbd-cap-s" viewBox="0 0 8 8" refX="6.6" refY="4" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M1,1 L7,4 L1,7 Z" fill="#0369a1" /></marker>
    </defs>
  )
}

export default function ContactBandDiagram({ type, phiM, chi, eg, phiS, Va, phase = 'joined' }: Props) {
  const xJ = MX + 0.34 * PW
  const toPath = (pts: [number, number][]) => 'M ' + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L ')

  // ---- physics (one computation; cases are just booleans) ----
  const xi = clamp(phiS - chi, 0.03, eg - 0.03) // E_c − E_F
  const ecBulk = xi
  const evBulk = xi - eg
  const Vbi = Math.abs(phiM - phiS)

  // ── SEPARATED phase: metal & SC apart, vacuum levels aligned (BEFORE contact) ──
  // Type-agnostic: E_F sits at E_c−xi (n: near E_c; p: near E_v). Additive branch —
  // the joined render below is untouched.
  if (phase === 'separated') {
    const gap = 46 // a clear empty gap → the two materials are visibly NOT touching
    const scL = xJ + gap
    const eFm = -phiM
    const ecv = -chi // E_c
    const evv = -chi - eg // E_v
    const efv = -chi - xi // E_F (SC)
    const eBotS = Math.min(eFm, evv) - 0.5
    const eTopS = 0.5
    const yS = (e: number) => TOP + ((eTopS - e) / (eTopS - eBotS)) * PLOT_H
    const scColorSep = type === 'n' ? 'fill-sky-700' : 'fill-rose-600'
    return (
      <div className="ltr w-full" dir="ltr">
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
          <Defs />
          <rect x={2} y={2} width={W - 4} height={H - 4} rx={14} fill="#fcfcff" stroke="#eef2f7" />

          {/* vacuum level (aligned across both) */}
          <line x1={MX} y1={yS(0)} x2={PR} y2={yS(0)} stroke={SLATE} strokeWidth={1.75} strokeDasharray="7 4" />
          <text x={PR + 4} y={yS(0) + 4} className="fill-slate-500" style={{ fontSize: FS, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: FSUB }}>0</tspan></text>
          <text x={(MX + PR) / 2} y={yS(0) - 7} textAnchor="middle" className="fill-slate-400" style={{ fontSize: FSR, fontWeight: 700 }}>רמת ואקום</text>

          {/* metal Fermi sea */}
          <rect x={MX} y={yS(eFm)} width={xJ - MX} height={yBot - yS(eFm)} fill="url(#cbd-metal)" rx={3} />
          <line x1={MX} y1={yS(eFm)} x2={xJ} y2={yS(eFm)} stroke="#475569" strokeWidth={2.25} />
          <text x={(MX + xJ) / 2} y={yBot - 10} textAnchor="middle" className="fill-slate-700" style={{ fontSize: FSR, fontWeight: 800 }}>מתכת (M)</text>
          <text x={MX + 5} y={yS(eFm) - 6} className="fill-slate-700" style={{ fontSize: FS - 2, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: FSUB }}>Fm</tspan></text>
          {/* φ_m */}
          <line x1={MX + 34} y1={yS(0)} x2={MX + 34} y2={yS(eFm)} stroke="#475569" strokeWidth={1.75} markerStart="url(#cbd-cap)" markerEnd="url(#cbd-cap)" />
          <text x={MX + 39} y={(yS(0) + yS(eFm)) / 2} className="fill-slate-700" style={{ fontSize: FS, fontWeight: 800 }}>φ<tspan dy={3} style={{ fontSize: FSUB }}>m</tspan></text>

          {/* semiconductor slab — a faint body so the SC side reads as clearly as the
              solid metal block on the left (sky for n, rose for p) */}
          <rect
            x={scL} y={yS(0) + 6} width={PR - scL} height={yBot - yS(0) - 6} rx={8}
            fill={type === 'n' ? '#0ea5e9' : '#f43f5e'} fillOpacity={0.05}
            stroke={type === 'n' ? '#bae6fd' : '#fecdd3'} strokeWidth={1}
          />

          {/* forbidden-gap shading */}
          <rect x={scL} y={yS(ecv)} width={PR - scL} height={yS(evv) - yS(ecv)} fill="url(#cbd-gap)" />
          <text x={PR - 8} y={(yS(ecv) + yS(evv)) / 2 + 4} textAnchor="end" className="fill-slate-300" style={{ fontSize: FSUB + 1, fontWeight: 700 }}>פס אסור</text>

          {/* SC flat bands */}
          <line x1={scL} y1={yS(ecv)} x2={PR} y2={yS(ecv)} stroke={SKY} strokeWidth={3} style={{ filter: GLOW_C }} />
          <line x1={scL} y1={yS(evv)} x2={PR} y2={yS(evv)} stroke={ROSE} strokeWidth={3} style={{ filter: GLOW_V }} />
          <line x1={scL} y1={yS(efv)} x2={PR} y2={yS(efv)} stroke="#0f172a" strokeWidth={1.5} strokeDasharray="6 3" />
          <text x={PR + 4} y={yS(ecv) - 3} className="fill-sky-700" style={{ fontSize: FS, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: FSUB }}>c</tspan></text>
          <text x={PR + 4} y={yS(evv) + 5} className="fill-rose-600" style={{ fontSize: FS, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: FSUB }}>v</tspan></text>
          <text x={PR + 4} y={yS(efv) + (xi < eg / 2 ? 13 : -4)} className="fill-slate-700" style={{ fontSize: FS, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: FSUB }}>F</tspan></text>
          <text x={(scL + PR) / 2} y={yBot - 10} textAnchor="middle" className={scColorSep} style={{ fontSize: FSR, fontWeight: 800 }}>{type === 'n' ? 'מל"מ-n (SC)' : 'מל"מ-p (SC)'}</text>
          {/* χ (vacuum → E_c) */}
          <line x1={scL + 30} y1={yS(0)} x2={scL + 30} y2={yS(ecv)} stroke="#0369a1" strokeWidth={1.75} markerStart="url(#cbd-cap-s)" markerEnd="url(#cbd-cap-s)" />
          <text x={scL + 35} y={(yS(0) + yS(ecv)) / 2} className="fill-sky-700" style={{ fontSize: FS, fontWeight: 800 }}>χ</text>
          {/* φ_s (vacuum → E_F) */}
          <line x1={scL + 80} y1={yS(0)} x2={scL + 80} y2={yS(efv)} stroke="#0369a1" strokeWidth={1.75} markerStart="url(#cbd-cap-s)" markerEnd="url(#cbd-cap-s)" />
          <text x={scL + 85} y={(yS(0) + yS(efv)) / 2} className="fill-sky-700" style={{ fontSize: FS, fontWeight: 800 }}>φ<tspan dy={3} style={{ fontSize: FSUB }}>s</tspan></text>

          {/* Fermi misalignment qV_bi (the drive that will bend the bands on contact) */}
          <line x1={xJ + gap / 2} y1={yS(eFm)} x2={xJ + gap / 2} y2={yS(efv)} stroke={AMBER} strokeWidth={2.25} markerStart="url(#cbd-cap-a)" markerEnd="url(#cbd-cap-a)" />
          <text x={xJ + gap / 2 + 5} y={(yS(eFm) + yS(efv)) / 2} className="fill-amber-600" style={{ fontSize: FS - 2, fontWeight: 700 }}>qV<tspan dy={3} style={{ fontSize: FSUB }}>bi</tspan></text>

          {/* badge */}
          <g>
            <rect x={PR - 92} y={TOP + 4} width={88} height={22} rx={6} fill="#f8fafc" stroke="#e2e8f0" />
            <text x={PR - 48} y={TOP + 19} textAnchor="middle" className="fill-slate-500" style={{ fontSize: FSUB + 3, fontWeight: 800 }}>לפני מגע</text>
          </g>
        </svg>
      </div>
    )
  }
  const rectifying = contactKind(type, phiM, phiS) === 'rectifying'
  const bendUp = phiM > phiS
  const sgn = bendUp ? 1 : -1
  const Veff = type === 'n' ? Va : -Va
  const drive = rectifying ? Math.max(Vbi - Veff, 0) : 0
  const eFm = -Veff
  const bendAmt = rectifying ? drive : Vbi
  const ecInterface = ecBulk + sgn * bendAmt
  const evInterface = ecInterface - eg

  // frame with headroom
  const eHi = Math.max(ecBulk, ecInterface, eFm, 0) + 0.4
  const eLo = Math.min(evBulk, evInterface, eFm, 0) - 0.35
  const eToY = (e: number) => TOP + ((eHi - e) / (eHi - eLo)) * PLOT_H

  // bending curve (1−u)²
  const wFrac = rectifying ? (Vbi > 0 ? Math.min(0.6, Math.sqrt(drive / Vbi) * 0.4) : 0) : 0.42
  const xRegion = xJ + wFrac * (PR - xJ)
  const N = 60
  const ecPts: [number, number][] = []
  const evPts: [number, number][] = []
  const eiPts: [number, number][] = []
  for (let i = 0; i <= N; i++) {
    const px = xJ + ((PR - xJ) * i) / N
    const within = px <= xRegion && xRegion > xJ
    const u = within ? (px - xJ) / (xRegion - xJ) : 1
    const ec = ecBulk + sgn * bendAmt * (1 - u) * (1 - u)
    ecPts.push([px, eToY(ec)])
    evPts.push([px, eToY(ec - eg)])
    eiPts.push([px, eToY(ec - eg / 2)])
  }
  const gapFill = toPath(ecPts) + ' L ' + [...evPts].reverse().map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L ') + ' Z'

  const scLabel = type === 'n' ? 'מל"מ-n (SC)' : 'מל"מ-p (SC)'
  const scColor = type === 'n' ? 'fill-sky-700' : 'fill-rose-600'

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <Defs />
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={14} fill="#fcfcff" stroke="#eef2f7" />

        {/* ── BRANCH 1: region shading ── */}
        {rectifying ? (
          <>
            {xRegion > xJ && (
              <>
                {/* gentle, uniform tint + a soft dashed edge so the depletion region reads clearly */}
                <rect x={xJ} y={TOP} width={xRegion - xJ} height={PLOT_H} fill="#ddd6fe" fillOpacity={0.55} />
                <line x1={xRegion} y1={TOP} x2={xRegion} y2={yBot} stroke="#a78bfa" strokeWidth={1} strokeDasharray="3 3" opacity={0.7} />
              </>
            )}
            {xRegion - xJ > 30 && (
              <text x={(xJ + xRegion) / 2} y={TOP + 14} textAnchor="middle" className="fill-violet-500" style={{ fontSize: FSR - 1, fontWeight: 700 }}>אזור מחסור</text>
            )}
          </>
        ) : type === 'n' ? (
          // electrons accumulate where E_c dips below E_F → shade from E_F downward
          <>
            <rect x={xJ} y={eToY(0)} width={xRegion - xJ} height={yBot - eToY(0)} fill="url(#cbd-acc-n)" />
            <text x={(xJ + xRegion) / 2} y={yBot - 26} textAnchor="middle" className="fill-emerald-600" style={{ fontSize: FSUB + 1, fontWeight: 700 }}>שכבת צבירה</text>
          </>
        ) : (
          // holes accumulate where E_v rises above E_F → shade from E_F upward
          <>
            <rect x={xJ} y={eToY(Math.max(evInterface, 0.02))} width={xRegion - xJ} height={eToY(0) - eToY(Math.max(evInterface, 0.02))} fill="url(#cbd-acc-p)" />
            <text x={(xJ + xRegion) / 2} y={eToY(Math.max(evInterface, 0.02)) - 5} textAnchor="middle" className="fill-rose-500" style={{ fontSize: FSUB + 1, fontWeight: 700 }}>שכבת צבירה</text>
          </>
        )}

        {/* forbidden-gap fill */}
        <path d={gapFill} fill="url(#cbd-gap)" />

        {/* metal Fermi sea */}
        <rect x={MX} y={eToY(eFm)} width={xJ - MX} height={yBot - eToY(eFm)} fill="url(#cbd-metal)" rx={3} />
        <line x1={MX} y1={eToY(eFm)} x2={xJ} y2={eToY(eFm)} stroke="#475569" strokeWidth={2.25} />
        <text x={(MX + xJ) / 2} y={yBot - 10} textAnchor="middle" className="fill-slate-700" style={{ fontSize: FSR, fontWeight: 800 }}>מתכת (M)</text>
        <text x={MX + 5} y={eToY(eFm) - 6} className="fill-slate-700" style={{ fontSize: FS - 2, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: FSUB }}>Fm</tspan></text>

        {/* interface line */}
        <line x1={xJ} y1={TOP} x2={xJ} y2={yBot} stroke="#cbd5e1" strokeWidth={1} />

        {/* E_F reference across the SC */}
        <line x1={xJ} y1={eToY(0)} x2={PR} y2={eToY(0)} stroke="#0f172a" strokeWidth={1.5} strokeDasharray="6 3" />
        <text x={PR + 4} y={eToY(0) + 4} className="fill-slate-700" style={{ fontSize: FS, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: FSUB }}>F</tspan></text>

        {/* bands + intrinsic level */}
        <path d={toPath(eiPts)} fill="none" stroke="#94a3b8" strokeWidth={1.25} strokeDasharray="3 3" />
        <path d={toPath(ecPts)} fill="none" stroke={SKY} strokeWidth={3} strokeLinejoin="round" style={{ filter: GLOW_C }} />
        <path d={toPath(evPts)} fill="none" stroke={ROSE} strokeWidth={3} strokeLinejoin="round" style={{ filter: GLOW_V }} />
        <text x={PR + 4} y={eToY(ecBulk) + 4} className="fill-sky-700" style={{ fontSize: FS, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: FSUB }}>c</tspan></text>
        <text x={PR + 4} y={eToY(evBulk + eg / 2) + 4} className="fill-slate-400" style={{ fontSize: FS, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: FSUB }}>i</tspan></text>
        <text x={PR + 4} y={eToY(evBulk) + 4} className="fill-rose-600" style={{ fontSize: FS, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: FSUB }}>v</tspan></text>
        <text x={(Math.max(xRegion, xJ + 30) + PR) / 2} y={yBot - 10} textAnchor="middle" className={scColor} style={{ fontSize: FSR, fontWeight: 800 }}>{scLabel}</text>

        {/* ── BRANCH 2: barrier marker / free-flow ── */}
        {rectifying && type === 'n' && (
          <>
            <line x1={xJ + 9} y1={eToY(eFm)} x2={xJ + 9} y2={eToY(ecInterface)} stroke={VIOLET} strokeWidth={2.5} markerStart="url(#cbd-cap-v)" markerEnd="url(#cbd-cap-v)" />
            <text x={xJ + 13} y={(eToY(eFm) + eToY(ecInterface)) / 2} className="fill-violet-700" style={{ fontSize: FS, fontWeight: 800 }}>φ<tspan dy={3} style={{ fontSize: FSUB }}>Bn</tspan></text>
          </>
        )}
        {rectifying && type === 'p' && (
          <>
            <line x1={xJ + 9} y1={eToY(eFm)} x2={xJ + 9} y2={eToY(evInterface)} stroke={ROSE} strokeWidth={2.5} markerStart="url(#cbd-cap-r)" markerEnd="url(#cbd-cap-r)" />
            <text x={xJ + 13} y={(eToY(eFm) + eToY(evInterface)) / 2} className="fill-rose-600" style={{ fontSize: FS, fontWeight: 800 }}>φ<tspan dy={3} style={{ fontSize: FSUB }}>Bp</tspan></text>
          </>
        )}
        {!rectifying && (
          <>
            <line x1={xJ - 22} y1={eToY(0) - (type === 'n' ? 16 : -16)} x2={xJ + 40} y2={eToY(0) - (type === 'n' ? 16 : -16)} stroke={EMERALD} strokeWidth={2.25} markerStart="url(#cbd-tip-e)" markerEnd="url(#cbd-tip-e)" />
            <text x={xJ + 46} y={eToY(0) - (type === 'n' ? 12 : -20)} className="fill-emerald-600" style={{ fontSize: FS - 3, fontWeight: 700 }}>זרימה חופשית — אין מחסום</text>
          </>
        )}

        {/* q(V_bi−V_A) bending (rectifying, when bent) */}
        {rectifying && drive > 0.02 && (
          <>
            <line x1={xRegion + 3} y1={eToY(ecBulk)} x2={xRegion + 3} y2={eToY(ecInterface)} stroke={AMBER} strokeWidth={1.75} markerStart="url(#cbd-cap-a)" markerEnd="url(#cbd-cap-a)" />
            <text x={xRegion + 8} y={(eToY(ecBulk) + eToY(ecInterface)) / 2} className="fill-amber-600" style={{ fontSize: FS - 3, fontWeight: 700 }}>q(V<tspan dy={3} style={{ fontSize: FSUB }}>bi</tspan><tspan dy={-3}>−V</tspan><tspan dy={3} style={{ fontSize: FSUB }}>A</tspan><tspan dy={-3}>)</tspan></text>
          </>
        )}

        {/* qV_A split between the Fermi levels */}
        {Math.abs(Va) > 0.02 && (
          <>
            <line x1={xJ - 18} y1={eToY(0)} x2={xJ - 18} y2={eToY(eFm)} stroke="#16a34a" strokeWidth={1.75} markerStart="url(#cbd-cap-g)" markerEnd="url(#cbd-cap-g)" />
            <text x={xJ - 16} y={(eToY(0) + eToY(eFm)) / 2 + 3} className="fill-emerald-600" style={{ fontSize: FS - 3, fontWeight: 700 }}>qV<tspan dy={3} style={{ fontSize: FSUB }}>A</tspan></text>
          </>
        )}

        {/* case badge (top-right) */}
        <g>
          <rect x={PR - 92} y={TOP + 4} width={88} height={22} rx={6} fill={rectifying ? '#f5f3ff' : '#ecfdf5'} stroke={rectifying ? '#ddd6fe' : '#a7f3d0'} />
          <text x={PR - 48} y={TOP + 19} textAnchor="middle" className={rectifying ? 'fill-violet-700' : 'fill-emerald-700'} style={{ fontSize: FSUB + 3, fontWeight: 800 }}>
            {type} · {rectifying ? 'מיישר' : 'אוהמי'}
          </text>
        </g>
      </svg>
    </div>
  )
}
