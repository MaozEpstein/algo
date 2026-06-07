import { useState, type ReactNode } from 'react'

/**
 * Two-junction npn band diagram along E-B-C, in equilibrium OR forward-active.
 * E_c forms a HUMP over the p-base (a barrier at each junction). In forward-active the
 * emitter bands rise by qV_A → the B-E barrier is LOWERED (electrons injected over it),
 * and the reverse collector bias pulls the collector bands down → the C-B side is a
 * steep downhill that COLLECTS whatever diffused across the thin base.
 *
 * Matches the hand-drawn target: region division + labelled depletion regions (both
 * modes); in forward-active, two overlays the viewer can toggle —
 *   • ENERGIES (green double-arrows): qV_A, q(V_bi−V_A) at B-E, q(V_bi+V_R) at C-B, qV_R;
 *   • CURRENTS (blue): J_e (inject→diffuse→collect), J_R (recombination), J_h (back-injection).
 * Conventions: E_c sky, E_v rose, E_F slate-dashed; tspan subscripts (no KaTeX); dir=ltr.
 */
interface Props {
  mode: 'eq' | 'active'
}

const W = 640
const H = 360
const MX = 26
const MR = 66
const TOP = 58
const BOT = 72
const PR = W - MR
const PW = PR - MX
const PLOT_H = H - TOP - BOT
const yBot = TOP + PLOT_H

const EG = 1.12
const XN = 0.16
const SKY = '#0ea5e9'
const ROSE = '#f43f5e'
const VIOLET = '#7c3aed'
const GREEN = '#059669'
const CUR = '#2563eb'
const GLOW_C = 'drop-shadow(0 1.5px 2px rgba(14,165,233,0.28))'
const GLOW_V = 'drop-shadow(0 1.5px 2px rgba(244,63,94,0.25))'

const fE = 0.2
const fEBd = 0.31
const fB = 0.45
const fBCd = 0.57
const smooth = (t: number) => t * t * (3 - 2 * t)
const lerp = (a: number, b: number, t: number) => a + (b - a) * smooth(Math.min(1, Math.max(0, t)))

/** Green double-arrow marking an energy magnitude, with a side label. */
function EnergyArrow({ x, yA, yB, lx, anchor, children }: { x: number; yA: number; yB: number; lx: number; anchor: 'start' | 'end' | 'middle'; children: ReactNode }) {
  return (
    <g>
      <line x1={x} y1={yA} x2={x} y2={yB} stroke={GREEN} strokeWidth={1.75} markerStart="url(#bbd-eg)" markerEnd="url(#bbd-eg)" />
      <text x={lx} y={(yA + yB) / 2 + 3} textAnchor={anchor} fill={GREEN} style={{ fontSize: 9.5, fontWeight: 800 }}>{children}</text>
    </g>
  )
}

export default function BjtBandDiagram({ mode }: Props) {
  const active = mode === 'active'
  const [showE, setShowE] = useState(true)
  const [showJ, setShowJ] = useState(true)

  const emShift = active ? 0.5 : 0
  const colShift = active ? -0.65 : 0
  const ecE = XN + emShift
  const ecBase = EG - XN
  const ecC = XN + colShift

  const ecAt = (f: number): number => {
    if (f <= fE) return ecE
    if (f <= fEBd) return lerp(ecE, ecBase, (f - fE) / (fEBd - fE))
    if (f <= fB) return ecBase
    if (f <= fBCd) return lerp(ecBase, ecC, (f - fB) / (fBCd - fB))
    return ecC
  }
  const eFAt = (f: number): number => {
    if (f <= fE) return emShift
    if (f <= fEBd) return lerp(emShift, 0, (f - fE) / (fEBd - fE))
    if (f <= fB) return 0
    if (f <= fBCd) return lerp(0, colShift, (f - fB) / (fBCd - fB))
    return colShift
  }

  const eHi = Math.max(ecBase, ecE, ecC, emShift, 0) + 0.34
  const eLo = Math.min(ecC - EG, colShift, -EG) - 0.34
  const xOf = (f: number) => MX + f * PW
  const yOf = (e: number) => TOP + ((eHi - e) / (eHi - eLo)) * PLOT_H

  const N = 150
  const ec: [number, number][] = []
  const ev: [number, number][] = []
  const ef: [number, number][] = []
  for (let i = 0; i <= N; i++) {
    const f = i / N
    const e = ecAt(f)
    ec.push([xOf(f), yOf(e)])
    ev.push([xOf(f), yOf(e - EG)])
    ef.push([xOf(f), yOf(eFAt(f))])
  }
  const toPath = (pts: [number, number][]) => 'M ' + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L ')

  const xBaseMid = xOf((fEBd + fB) / 2)
  const depLabel = (x0: number, x1: number, label: string) => {
    const yb = yBot + 30
    return (
      <g>
        <line x1={x0} y1={yb} x2={x1} y2={yb} stroke={VIOLET} strokeWidth={1.25} markerStart="url(#bbd-dep)" markerEnd="url(#bbd-dep)" />
        <text x={(x0 + x1) / 2} y={yb + 13} textAnchor="middle" className="fill-violet-500" style={{ fontSize: 9.5, fontWeight: 700 }}>{label}</text>
      </g>
    )
  }

  return (
    <div className="ltr w-full" dir="ltr">
      {active && (
        <div className="mb-2 flex flex-wrap items-center justify-center gap-2" dir="rtl">
          <span className="text-xs font-medium text-slate-500">הצג:</span>
          {([
            { on: showE, set: setShowE, label: 'גדלי-אנרגיה', cls: 'border-emerald-500 bg-emerald-500' },
            { on: showJ, set: setShowJ, label: 'זרמים', cls: 'border-blue-500 bg-blue-500' },
          ] as const).map((t) => (
            <button
              key={t.label}
              onClick={() => t.set(!t.on)}
              aria-pressed={t.on}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${t.on ? `${t.cls} text-white shadow` : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <defs>
          <marker id="bbd-eg" viewBox="0 0 8 8" refX="6.6" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M1,1 L7,4 L1,7 Z" fill={GREEN} /></marker>
          <marker id="bbd-dep" viewBox="0 0 8 8" refX="6.6" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M1,1 L7,4 L1,7 Z" fill={VIOLET} /></marker>
          <marker id="bbd-j" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1,1 L9,5 L1,9 Z" fill={CUR} /></marker>
        </defs>
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={14} fill="#fcfcff" stroke="#eef2f7" />

        {/* region tints */}
        <rect x={xOf(0)} y={TOP} width={xOf(fE) - xOf(0)} height={PLOT_H} fill={SKY} fillOpacity={0.05} />
        <rect x={xOf(fEBd)} y={TOP} width={xOf(fB) - xOf(fEBd)} height={PLOT_H} fill={ROSE} fillOpacity={0.05} />
        <rect x={xOf(fBCd)} y={TOP} width={xOf(1) - xOf(fBCd)} height={PLOT_H} fill={SKY} fillOpacity={0.05} />

        {/* depletion regions + dashed boundaries */}
        {[[fE, fEBd], [fB, fBCd]].map(([a, b], i) => (
          <g key={i}>
            <rect x={xOf(a)} y={TOP} width={xOf(b) - xOf(a)} height={PLOT_H} fill="#ddd6fe" fillOpacity={0.5} />
            <line x1={xOf(a)} y1={TOP} x2={xOf(a)} y2={yBot} stroke={VIOLET} strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
            <line x1={xOf(b)} y1={TOP} x2={xOf(b)} y2={yBot} stroke={VIOLET} strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
          </g>
        ))}

        {/* region labels + junction tags + depletion brackets (bottom) */}
        <text x={(xOf(0) + xOf(fE)) / 2} y={yBot + 15} textAnchor="middle" className="fill-sky-700" style={{ fontSize: 12, fontWeight: 800 }}>פולט · n</text>
        <text x={xBaseMid} y={yBot + 15} textAnchor="middle" className="fill-rose-600" style={{ fontSize: 12, fontWeight: 800 }}>בסיס · p</text>
        <text x={(xOf(fBCd) + xOf(1)) / 2} y={yBot + 15} textAnchor="middle" className="fill-sky-700" style={{ fontSize: 12, fontWeight: 800 }}>קולט · n</text>
        <text x={(xOf(fE) + xOf(fEBd)) / 2} y={TOP - 6} textAnchor="middle" className="fill-violet-500" style={{ fontSize: 9.5, fontWeight: 700 }}>B-E</text>
        <text x={(xOf(fB) + xOf(fBCd)) / 2} y={TOP - 6} textAnchor="middle" className="fill-violet-500" style={{ fontSize: 9.5, fontWeight: 700 }}>C-B</text>
        {depLabel(xOf(fE), xOf(fEBd), 'אזור מחסור B-E')}
        {depLabel(xOf(fB), xOf(fBCd), 'אזור מחסור C-B')}

        {/* bands */}
        <path d={toPath(ef)} fill="none" stroke="#475569" strokeWidth={1.4} strokeDasharray="6 3" />
        <path d={toPath(ec)} fill="none" stroke={SKY} strokeWidth={3} strokeLinejoin="round" style={{ filter: GLOW_C }} />
        <path d={toPath(ev)} fill="none" stroke={ROSE} strokeWidth={3} strokeLinejoin="round" style={{ filter: GLOW_V }} />
        <text x={PR + 5} y={yOf(ecC) + 4} className="fill-sky-700" style={{ fontSize: 13, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: 9 }}>c</tspan></text>
        <text x={PR + 5} y={yOf(ecC - EG) + 4} className="fill-rose-600" style={{ fontSize: 13, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: 9 }}>v</tspan></text>
        {active ? (
          <>
            <text x={xOf(0) + 2} y={yOf(emShift) - 5} className="fill-slate-600" style={{ fontSize: 11, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: 8 }}>FE</tspan></text>
            <text x={xOf(fEBd) + 6} y={yOf(0) - 5} textAnchor="start" className="fill-slate-600" style={{ fontSize: 11, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: 8 }}>F</tspan></text>
            <text x={PR + 5} y={yOf(colShift) + 4} className="fill-slate-600" style={{ fontSize: 11, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: 8 }}>FC</tspan></text>
          </>
        ) : (
          <text x={PR + 5} y={yOf(0) + 4} className="fill-slate-600" style={{ fontSize: 13, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: 9 }}>F</tspan></text>
        )}

        {/* ── ENERGIES overlay (green) ── */}
        {active && showE && (
          <>
            <EnergyArrow x={xOf(0.085)} yA={yOf(emShift)} yB={yOf(0)} lx={xOf(0.085) + 6} anchor="start">
              qV<tspan dy={2} style={{ fontSize: 7 }}>A</tspan>
            </EnergyArrow>
            <EnergyArrow x={xOf(fE) + 6} yA={yOf(ecE)} yB={yOf(ecBase)} lx={xOf(fE) + 1} anchor="end">
              q(V<tspan dy={2} style={{ fontSize: 7 }}>bi</tspan><tspan dy={-2}>−V</tspan><tspan dy={2} style={{ fontSize: 7 }}>A</tspan><tspan dy={-2}>)</tspan>
            </EnergyArrow>
            <EnergyArrow x={xOf(fBCd) - 6} yA={yOf(ecBase)} yB={yOf(ecC)} lx={xOf(fBCd) + 2} anchor="start">
              q(V<tspan dy={2} style={{ fontSize: 7 }}>bi</tspan><tspan dy={-2}>+V</tspan><tspan dy={2} style={{ fontSize: 7 }}>R</tspan><tspan dy={-2}>)</tspan>
            </EnergyArrow>
            <EnergyArrow x={xOf(0.9)} yA={yOf(0)} yB={yOf(colShift)} lx={xOf(0.9) - 6} anchor="end">
              qV<tspan dy={2} style={{ fontSize: 7 }}>R</tspan>
            </EnergyArrow>
          </>
        )}

        {/* ── CURRENTS overlay (blue, curved like the source sketch) ── */}
        {active && showJ && (
          <>
            {/* J_e — electron injection over the B-E barrier */}
            <path d={`M ${xOf(0.115).toFixed(1)} ${(yOf(ecE) - 2).toFixed(1)} C ${(xOf(fE) + 8).toFixed(1)} ${(yOf(ecE) - 6).toFixed(1)}, ${(xOf(fE) + 4).toFixed(1)} ${(yOf(ecBase) - 18).toFixed(1)}, ${(xOf(fEBd) + 7).toFixed(1)} ${(yOf(ecBase) - 9).toFixed(1)}`} fill="none" stroke={CUR} strokeWidth={2.3} strokeLinecap="round" markerEnd="url(#bbd-j)" />
            {/* diffusion across the thin base (dotted) */}
            <path d={`M ${(xOf(fEBd) + 7).toFixed(1)} ${(yOf(ecBase) - 10).toFixed(1)} L ${xOf(fB).toFixed(1)} ${(yOf(ecBase) - 10).toFixed(1)}`} fill="none" stroke={CUR} strokeWidth={2} strokeDasharray="2 4" strokeLinecap="round" opacity={0.85} />
            {/* collection — electrons roll down the C-B step into the collector */}
            <path d={`M ${xOf(fB).toFixed(1)} ${(yOf(ecBase) - 9).toFixed(1)} C ${(xOf(fB) + 18).toFixed(1)} ${(yOf(ecBase) - 13).toFixed(1)}, ${xOf(fBCd).toFixed(1)} ${(yOf(ecC) - 22).toFixed(1)}, ${xOf(0.79).toFixed(1)} ${(yOf(ecC) - 6).toFixed(1)}`} fill="none" stroke={CUR} strokeWidth={2.3} strokeLinecap="round" markerEnd="url(#bbd-j)" />
            {/* J_e (electron current) at injection, J_ec at the collector */}
            <text x={xOf(0.205)} y={yOf(ecBase) - 13} textAnchor="middle" fill={CUR} style={{ fontSize: 11, fontWeight: 800 }}>J<tspan dy={2} style={{ fontSize: 7.5 }}>e</tspan></text>
            <text x={xOf(0.52)} y={yOf(ecBase) - 13} textAnchor="middle" fill={CUR} style={{ fontSize: 11, fontWeight: 800 }}>J<tspan dy={2} style={{ fontSize: 7.5 }}>ec</tspan></text>

            {/* J_R — base recombination: electrons come DOWN, holes come UP, meeting */}
            <path d={`M ${(xBaseMid - 3).toFixed(1)} ${(yOf(ecBase) + 7).toFixed(1)} Q ${(xBaseMid - 17).toFixed(1)} ${(((yOf(ecBase) + yOf(ecBase - EG)) / 2) - 10).toFixed(1)} ${(xBaseMid - 3).toFixed(1)} ${(((yOf(ecBase) + yOf(ecBase - EG)) / 2) - 1).toFixed(1)}`} fill="none" stroke={CUR} strokeWidth={1.8} strokeLinecap="round" markerEnd="url(#bbd-j)" />
            <path d={`M ${(xBaseMid + 3).toFixed(1)} ${(yOf(ecBase - EG) - 7).toFixed(1)} Q ${(xBaseMid + 17).toFixed(1)} ${(((yOf(ecBase) + yOf(ecBase - EG)) / 2) + 10).toFixed(1)} ${(xBaseMid + 3).toFixed(1)} ${(((yOf(ecBase) + yOf(ecBase - EG)) / 2) + 1).toFixed(1)}`} fill="none" stroke={CUR} strokeWidth={1.8} strokeLinecap="round" markerEnd="url(#bbd-j)" />
            <text x={xBaseMid - 9} y={yOf(ecBase) + 21} textAnchor="end" fill={CUR} style={{ fontSize: 8.5, fontWeight: 700 }}>רקומ׳ אלק׳</text>
            <text x={xBaseMid + 9} y={yOf(ecBase - EG) - 8} textAnchor="start" fill={CUR} style={{ fontSize: 8.5, fontWeight: 700 }}>רקומ׳ חורים</text>

            {/* J_h — hole back-injection (curved, base → emitter along E_v) */}
            <path d={`M ${xOf(fEBd).toFixed(1)} ${(yOf(ecBase - EG) + 2).toFixed(1)} Q ${(xOf(fE) + 12).toFixed(1)} ${(yOf(ecBase - EG) + 20).toFixed(1)} ${(xOf(fE) - 5).toFixed(1)} ${(yOf(ecE - EG) + 2).toFixed(1)}`} fill="none" stroke={CUR} strokeWidth={1.9} strokeLinecap="round" markerEnd="url(#bbd-j)" opacity={0.9} />
            <text x={xOf(fE) - 3} y={yOf(ecE - EG) + 17} textAnchor="start" fill={CUR} style={{ fontSize: 9.5, fontWeight: 800 }}>J<tspan dy={2} style={{ fontSize: 7 }}>h</tspan></text>
          </>
        )}

        {/* mode badge */}
        <g>
          <rect x={MX + 4} y={TOP + 2} width={active ? 92 : 76} height={19} rx={6} fill={active ? '#ecfdf5' : '#f8fafc'} stroke={active ? '#a7f3d0' : '#e2e8f0'} />
          <text x={MX + 4 + (active ? 46 : 38)} y={TOP + 15} textAnchor="middle" className={active ? 'fill-emerald-700' : 'fill-slate-500'} style={{ fontSize: 11, fontWeight: 800 }}>{active ? 'פעיל-קדמי' : 'שיווי משקל'}</text>
        </g>
      </svg>

      {/* legend */}
      <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-500" dir="rtl">
        <span><span className="font-bold text-violet-500">▭</span> אזור מחסור</span>
        {active && showE && <span><span className="font-bold text-emerald-600">↕</span> גדלי-אנרגיה</span>}
        {active && showJ && <span><span className="font-bold text-blue-600">→</span> זרמים</span>}
      </div>
    </div>
  )
}
