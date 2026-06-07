import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useAnimationFrame } from 'framer-motion'
import Tex from '@/core/components/Tex'

/**
 * Rich, animated picture of the BJT in one of its four operating modes, drawn as a
 * complete BIASED CIRCUIT (matching the hand-drawn figure): the E│B│C block on top,
 * and below it the two external sources V_BE / V_BC wired to the common base.
 *
 * IMPORTANT consistency choice: every moving dot is an ELECTRON (the real carrier),
 * forming ONE continuous loop — inside the block AND along the external wires. The
 * CONVENTIONAL current I is, by definition, opposite to the electrons, so it is shown
 * only as a magnitude tag (≈0 / > 0 / ≫ 0) with an explicit note — never as an arrow
 * pointing against the electrons (which is what looked contradictory before).
 *
 * From the two junction biases (beF / bcF) it shows — and animates — what happens:
 *   • the depletion region at each junction (labelled; forward → narrow, reverse → wide);
 *   • the electron loop (direction per mode) inside and through the wires;
 *   • each source labelled V_BE / V_BC with its sign (> 0 forward / < 0 reverse);
 *   • the terminal-current magnitudes I_E / I_B / I_C, tagged ≈0 / > 0 / ≫ 0.
 * Animation reuses the PnCurrentFlow idiom (useAnimationFrame + reduced-motion guard).
 * SVG text uses tspans (no KaTeX inside SVG); KaTeX only in the HTML caption.
 */
interface Props {
  beF: boolean
  bcF: boolean
}

const W = 400
const H = 304
const XL = 80
const XR = 320
const xEB = 164
const xBC = 210
const baseX = (xEB + xBC) / 2
const BARY = 46
const BARH = 70
const blockBot = BARY + BARH
const flowY = BARY + BARH / 2
const ELEC = '#0ea5e9' // electrons (sky)
const ELEC_DOT = '#38bdf8'
const CUR = '#0284c7' // current magnitude labels (blue)
const VIOLET = '#a78bfa'
const VIOLET_FILL = '#ede9fe'
const GREEN = '#10b981'
const BLUE = '#3b82f6'
const WIRE = '#cbd5e1'
const DEP_FWD = 5
const DEP_REV = 15

const eWireX = 48
const cWireX = 352
const railY = 240
const cxVbe = (eWireX + baseX) / 2
const cxVbc = (cWireX + baseX) / 2
const midEC = (flowY + railY) / 2
const midB = (blockBot + railY) / 2

const prefersReduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const frac = (t: number) => t - Math.floor(t)

// wire routes (block-end → rail-end). Reversed when electrons flow toward the block.
const E_OUT: [number, number][] = [[XL, flowY], [eWireX, flowY], [eWireX, railY]]
const C_OUT: [number, number][] = [[XR, flowY], [cWireX, flowY], [cWireX, railY]]
const B_OUT: [number, number][] = [[baseX, blockBot], [baseX, railY]]
const rev = (r: [number, number][]): [number, number][] => [...r].reverse()

/** Positions of `n` dots flowing along a polyline route, phased for animation. */
function dotsAlong(route: [number, number][], n: number, phase: number): [number, number][] {
  const segs: { a: [number, number]; b: [number, number]; L: number }[] = []
  let total = 0
  for (let i = 1; i < route.length; i++) {
    const a = route[i - 1], b = route[i]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    segs.push({ a, b, L }); total += L
  }
  const out: [number, number][] = []
  if (total === 0) return out
  for (let i = 0; i < n; i++) {
    let d = frac(phase + i / n) * total
    for (let s = 0; s < segs.length; s++) {
      const seg = segs[s]
      if (d <= seg.L || s === segs.length - 1) {
        const t = seg.L ? Math.min(1, d / seg.L) : 0
        out.push([seg.a[0] + (seg.b[0] - seg.a[0]) * t, seg.a[1] + (seg.b[1] - seg.a[1]) * t])
        break
      }
      d -= seg.L
    }
  }
  return out
}

type Level = 'zero' | 'small' | 'large'
const LEVELS: Record<Level, string> = { zero: '≈ 0', small: '> 0', large: '≫ 0' }
const COUNTS: Record<Level, number> = { zero: 0, small: 3, large: 6 }

interface Stream { from: number; to: number; n: number }
interface Mode { name: string; en: string; outcome: ReactNode; color: string; streams: Stream[]; flooded?: boolean; e: Level; b: Level; c: Level; eIn: boolean; cIn: boolean; bIn: boolean; sw?: 'open' | 'closed' }

const MODES: Record<string, Mode> = {
  'true,false': {
    name: 'פעיל-קדמי', en: 'Forward-Active', color: GREEN,
    outcome: <>הולכה / מגבר — <Tex>{'I_C\\approx\\beta I_B'}</Tex></>,
    streams: [{ from: XL + 16, to: XR - 16, n: 9 }], e: 'large', b: 'small', c: 'large', eIn: true, cIn: false, bIn: false,
  },
  'true,true': {
    name: 'רוויה', en: 'Saturation', color: '#f59e0b',
    outcome: <>מפסק סגור — <Tex>{'V_{CE}\\approx0.2\\,V'}</Tex></>,
    streams: [{ from: XL + 16, to: baseX, n: 5 }, { from: XR - 16, to: baseX, n: 5 }], flooded: true, e: 'large', b: 'large', c: 'large', eIn: true, cIn: true, bIn: false, sw: 'closed',
  },
  'false,false': {
    name: 'קטעון', en: 'Cut-off', color: '#64748b',
    outcome: <>מפסק פתוח — <Tex>{'I\\approx0'}</Tex></>,
    streams: [], e: 'zero', b: 'zero', c: 'zero', eIn: false, cIn: false, bIn: false, sw: 'open',
  },
  'false,true': {
    name: 'פעיל-הפוך', en: 'Reverse-Active', color: '#6366f1',
    outcome: <>הגבר חלש מאוד</>,
    streams: [{ from: XR - 16, to: XL + 16, n: 4 }], e: 'small', b: 'small', c: 'small', eIn: false, cIn: true, bIn: false,
  },
}

/** Tiny switch glyph reinforcing the open (cutoff) / closed (saturation) metaphor. */
function SwitchIcon({ closed }: { closed: boolean }) {
  return (
    <svg viewBox="0 0 34 18" width={30} height={16} aria-hidden>
      <circle cx={5} cy={13} r={2.6} fill="#475569" />
      <circle cx={29} cy={13} r={2.6} fill="#475569" />
      <line x1={5} y1={13} x2={closed ? 29 : 24} y2={closed ? 13 : 5} stroke="#475569" strokeWidth={2} strokeLinecap="round" />
    </svg>
  )
}

/** Small sky arrow showing the ELECTRON direction on a vertical wire. */
function ElectronArrow({ x, y, dir }: { x: number; y: number; dir: 'up' | 'down' }) {
  const half = 11
  const y1 = dir === 'up' ? y + half : y - half
  const y2 = dir === 'up' ? y - half : y + half
  return <line x1={x} y1={y1} x2={x} y2={y2} stroke={ELEC} strokeWidth={2} strokeLinecap="round" markerEnd="url(#bmd-el)" />
}

/** Blue current-magnitude tag (no direction — current is opposite to the electrons). */
function CurrentTag({ x, y, level, sub, side }: { x: number; y: number; level: Level; sub: string; side: 'start' | 'end' }) {
  const off = level === 'zero'
  return (
    <text x={x} y={y} textAnchor={side} fill={off ? '#94a3b8' : CUR} style={{ fontSize: 11.5, fontWeight: 800 }}>
      I<tspan dy={2} style={{ fontSize: 8 }}>{sub}</tspan><tspan dy={-2}> {LEVELS[level]}</tspan>
    </text>
  )
}

/** A DC-source (battery) glyph straddling the rail, with +/− plates and a signed label. */
function Source({ cx, sub, forward }: { cx: number; sub: string; forward: boolean }) {
  const color = forward ? GREEN : BLUE
  return (
    <g>
      <line x1={cx - 5} y1={railY - 10} x2={cx - 5} y2={railY + 10} stroke={color} strokeWidth={2.25} />
      <line x1={cx + 5} y1={railY - 6} x2={cx + 5} y2={railY + 6} stroke={color} strokeWidth={4} />
      <text x={cx - 5} y={railY - 14} textAnchor="middle" fill={color} style={{ fontSize: 10, fontWeight: 800 }}>+</text>
      <text x={cx + 5} y={railY - 13} textAnchor="middle" fill={color} style={{ fontSize: 12, fontWeight: 800 }}>−</text>
      <text x={cx} y={railY + 24} textAnchor="middle" fill={color} style={{ fontSize: 11.5, fontWeight: 800 }}>
        V<tspan dy={2} style={{ fontSize: 8 }}>{sub}</tspan><tspan dy={-2}>{forward ? ' > 0' : ' < 0'}</tspan>
      </text>
    </g>
  )
}

export default function BjtModeDiagram({ beF, bcF }: Props) {
  const m = MODES[`${beF},${bcF}`]
  const phaseRef = useRef(0)
  const [phase, setPhase] = useState(0)
  const mRef = useRef(m)
  useEffect(() => { mRef.current = m })

  useAnimationFrame((_t, dt) => {
    if (prefersReduced || mRef.current.streams.length === 0) return
    phaseRef.current += 0.4 * (dt / 1000)
    setPhase(phaseRef.current)
  })

  const ebHalf = beF ? DEP_FWD : DEP_REV
  const bcHalf = bcF ? DEP_FWD : DEP_REV

  // electrons inside the block
  const inside: { x: number; y: number; k: string }[] = []
  m.streams.forEach((s, si) => {
    for (let i = 0; i < s.n; i++) {
      const f = frac(phase + i / s.n)
      inside.push({ x: s.from + (s.to - s.from) * f, y: flowY, k: `${si}-${i}` })
    }
  })

  // electrons in the external wires (same loop), direction per mode
  const wireDots: { x: number; y: number; k: string }[] = []
  ;([
    ['e', m.eIn ? rev(E_OUT) : E_OUT, m.e],
    ['c', m.cIn ? rev(C_OUT) : C_OUT, m.c],
    ['b', m.bIn ? rev(B_OUT) : B_OUT, m.b],
  ] as const).forEach(([key, route, lvl]) => {
    dotsAlong(route, COUNTS[lvl], phase).forEach((p, i) => wireDots.push({ x: p[0], y: p[1], k: `${key}-${i}` }))
  })

  return (
    <div className="ltr w-full" dir="ltr">
      {/* mode badge (HTML — KaTeX allowed here) */}
      <div className="mb-2 flex flex-wrap items-center justify-center gap-2">
        <span className="rounded-full px-3.5 py-1 text-sm font-extrabold text-white shadow-sm" style={{ backgroundColor: m.color }}>{m.name}</span>
        <span className="text-xs font-mono text-slate-400" dir="ltr">{m.en}</span>
        <span className="text-sm font-semibold text-slate-600">· {m.outcome}</span>
        {m.sw && (
          <span className="inline-flex items-center" title={m.sw === 'closed' ? 'מפסק סגור' : 'מפסק פתוח'}>
            <SwitchIcon closed={m.sw === 'closed'} />
          </span>
        )}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <defs>
          <marker id="bmd-el" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto"><path d="M1,1 L9,5 L1,9 Z" fill={ELEC} /></marker>
          <linearGradient id="bmd-n" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7dd3fc" stopOpacity={0.4} /><stop offset="100%" stopColor="#e0f2fe" stopOpacity={0.25} /></linearGradient>
          <linearGradient id="bmd-p" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fda4af" stopOpacity={0.45} /><stop offset="100%" stopColor="#ffe4e6" stopOpacity={0.3} /></linearGradient>
          <linearGradient id="bmd-pf" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fb7185" stopOpacity={0.65} /><stop offset="100%" stopColor="#fecdd3" stopOpacity={0.45} /></linearGradient>
        </defs>
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={14} fill="#fcfdff" stroke="#eef2f7" />

        {/* legends (top): depletion + electrons */}
        <rect x={16} y={15} width={17} height={12} rx={2} fill={VIOLET_FILL} stroke={VIOLET} strokeWidth={1} strokeDasharray="3 2" />
        <text x={37} y={25} className="fill-violet-500" style={{ fontSize: 10, fontWeight: 700 }}>אזור המחסור</text>
        <circle cx={W - 116} cy={21} r={4} fill={ELEC_DOT} />
        <text x={W - 16} y={25} textAnchor="end" className="fill-sky-600" style={{ fontSize: 10, fontWeight: 700 }}>= תנועת אלקטרונים</text>

        {/* ── external bias circuit (behind block) ── */}
        <path d={`M ${XL} ${flowY} H ${eWireX} V ${railY}`} fill="none" stroke={WIRE} strokeWidth={2} strokeLinejoin="round" />
        <path d={`M ${XR} ${flowY} H ${cWireX} V ${railY}`} fill="none" stroke={WIRE} strokeWidth={2} strokeLinejoin="round" />
        <path d={`M ${baseX} ${blockBot} V ${railY}`} fill="none" stroke={WIRE} strokeWidth={2} />
        <line x1={eWireX} y1={railY} x2={baseX} y2={railY} stroke={WIRE} strokeWidth={2} />
        <line x1={cWireX} y1={railY} x2={baseX} y2={railY} stroke={WIRE} strokeWidth={2} />
        <circle cx={baseX} cy={railY} r={3.5} fill="#94a3b8" />
        <Source cx={cxVbe} sub="BE" forward={beF} />
        <Source cx={cxVbc} sub="BC" forward={bcF} />

        {/* ── transistor block ── */}
        <rect x={XL} y={BARY} width={xEB - XL} height={BARH} fill="url(#bmd-n)" />
        <rect x={xEB} y={BARY} width={xBC - xEB} height={BARH} fill={m.flooded ? 'url(#bmd-pf)' : 'url(#bmd-p)'} />
        <rect x={xBC} y={BARY} width={XR - xBC} height={BARH} fill="url(#bmd-n)" />
        <rect x={xEB - ebHalf} y={BARY} width={2 * ebHalf} height={BARH} fill={VIOLET_FILL} stroke={VIOLET} strokeWidth={1} strokeDasharray="3 3" />
        <rect x={xBC - bcHalf} y={BARY} width={2 * bcHalf} height={BARH} fill={VIOLET_FILL} stroke={VIOLET} strokeWidth={1} strokeDasharray="3 3" />
        <rect x={XL} y={BARY} width={XR - XL} height={BARH} rx={7} fill="none" stroke="#cbd5e1" strokeWidth={1.5} />
        <circle cx={XL} cy={flowY} r={3.5} fill="#64748b" />
        <circle cx={XR} cy={flowY} r={3.5} fill="#64748b" />

        {/* region letters + terminal letters */}
        <text x={(XL + xEB) / 2} y={BARY + 21} textAnchor="middle" className="fill-sky-700" style={{ fontSize: 16, fontWeight: 800 }}>N</text>
        <text x={baseX} y={BARY + 20} textAnchor="middle" className="fill-rose-600" style={{ fontSize: 13, fontWeight: 800 }}>P</text>
        <text x={(xBC + XR) / 2} y={BARY + 21} textAnchor="middle" className="fill-sky-700" style={{ fontSize: 16, fontWeight: 800 }}>N</text>
        {m.flooded && <text x={baseX} y={BARY + 35} textAnchor="middle" className="fill-rose-500" style={{ fontSize: 8.5, fontWeight: 700 }}>מוצף</text>}
        <text x={XL - 8} y={flowY - 9} textAnchor="end" className="fill-slate-500" style={{ fontSize: 12, fontWeight: 800 }}>E</text>
        <text x={XR + 8} y={flowY - 9} textAnchor="start" className="fill-slate-500" style={{ fontSize: 12, fontWeight: 800 }}>C</text>
        <text x={baseX + 9} y={blockBot + 14} textAnchor="start" className="fill-slate-500" style={{ fontSize: 12, fontWeight: 800 }}>B</text>

        {/* electrons — inside the block */}
        {inside.map((p) => (
          <circle key={p.k} cx={p.x} cy={p.y} r={4} fill={ELEC_DOT} style={{ filter: 'drop-shadow(0 0 5px rgba(56,189,248,0.9))' }} />
        ))}
        {m.streams.length === 0 && (
          <text x={(XL + XR) / 2} y={flowY + 4} textAnchor="middle" className="fill-slate-300" style={{ fontSize: 11, fontWeight: 700 }}>— אין זרם —</text>
        )}

        {/* junction state labels */}
        <text x={xEB - 6} y={blockBot + 14} textAnchor="end" style={{ fontSize: 9.5, fontWeight: 700 }} fill={beF ? GREEN : BLUE}>B-E · {beF ? 'קדמי' : 'אחורי'}</text>
        <text x={xBC + 6} y={blockBot + 14} textAnchor="start" style={{ fontSize: 9.5, fontWeight: 700 }} fill={bcF ? GREEN : BLUE}>C-B · {bcF ? 'קדמי' : 'אחורי'}</text>

        {/* electrons — in the external wires (same loop) */}
        {wireDots.map((p) => (
          <circle key={p.k} cx={p.x} cy={p.y} r={3.2} fill={ELEC_DOT} style={{ filter: 'drop-shadow(0 0 3px rgba(56,189,248,0.8))' }} />
        ))}

        {/* electron-direction arrows (only where there is flow) */}
        {m.e !== 'zero' && <ElectronArrow x={eWireX} y={midEC} dir={m.eIn ? 'up' : 'down'} />}
        {m.c !== 'zero' && <ElectronArrow x={cWireX} y={midEC} dir={m.cIn ? 'up' : 'down'} />}
        {m.b !== 'zero' && <ElectronArrow x={baseX} y={midB} dir={m.bIn ? 'up' : 'down'} />}

        {/* current-magnitude tags (blue) */}
        <CurrentTag x={eWireX - 10} y={midEC + 4} level={m.e} sub="E" side="end" />
        <CurrentTag x={cWireX + 10} y={midEC + 4} level={m.c} sub="C" side="start" />
        <CurrentTag x={baseX + 11} y={midB + 4} level={m.b} sub="B" side="start" />
      </svg>

      <p className="mt-2 text-center text-sm leading-relaxed text-slate-500">
        הנקודות הן <span className="font-semibold text-sky-600">תנועת האלקטרונים</span> בפועל — וכיוונה <b>הפוך</b> לכיוון
        ה<span className="font-semibold text-sky-700">זרם המוסכם</span> <Tex>{'I'}</Tex> (כך מוגדר הזרם החשמלי). תמיד{' '}
        <span className="font-semibold text-sky-700"><Tex>{'I_E = I_C + I_B'}</Tex></span>.
      </p>
    </div>
  )
}
