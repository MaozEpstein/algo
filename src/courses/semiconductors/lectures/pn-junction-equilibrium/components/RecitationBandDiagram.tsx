/**
 * A FAITHFUL reproduction of the תרגול-1 energy-band figures (שאלה 1, סעיפים ב/ה).
 * Unlike the interactive BandDiagram/BiasedBandDiagram, this is a static schematic
 * that reproduces the recitation drawing exactly — including every labeled gap
 * between the energy levels, drawn with double-headed dimension arrows:
 *   • equilibrium (ב): E_c, E_Fi, E_F, E_v + eV_bi, eφ_Fp, eφ_Fn
 *   • reverse bias (ה): E_c, E_Fi, E_Fp, E_v, E_Fn + e(V_bi+V_a), eφ_Fp, eV_a, eφ_Fn
 * Pure SVG; geometry is schematic (not data-driven) to match the hand-drawn source.
 */
type Mode = 'equilibrium' | 'reverse'

const W = 600
const H = 320
const X0 = 70 // band start (left)
const X1 = 520 // band end (right)
const XJ = 300 // junction

/** Smooth step path for a band that is flat at yL (p-side) then yR (n-side). */
function band(yL: number, yR: number): string {
  return `M ${X0} ${yL} L 250 ${yL} C 295 ${yL} 305 ${yR} 350 ${yR} L ${X1} ${yR}`
}

/** The dimension labels, with proper subscripts (SVG tspans). */
function DimLabel({ t }: { t: string }) {
  const sub = (s: string) => (
    <tspan dy={3} style={{ fontSize: 9 }}>
      {s}
    </tspan>
  )
  switch (t) {
    case 'eVbi':
      return <>eV{sub('bi')}</>
    case 'eVbiVa':
      return (
        <>
          e(V{sub('bi')}
          <tspan dy={-3}>+V</tspan>
          {sub('a')}
          <tspan dy={-3}>)</tspan>
        </>
      )
    case 'ephiFp':
      return <>eφ{sub('Fp')}</>
    case 'ephiFn':
      return <>eφ{sub('Fn')}</>
    case 'eVa':
      return <>eV{sub('a')}</>
    default:
      return null
  }
}

interface Cfg {
  ec: [number, number]
  ev: [number, number]
  efi: [number, number]
  fermiP: number
  fermiN: number
  single: boolean // one flat E_F (equilibrium) vs split E_Fp / E_Fn
  arrows: { x: number; y1: number; y2: number; t: string }[]
}

const CFG: Record<Mode, Cfg> = {
  equilibrium: {
    ec: [70, 130],
    ev: [200, 260],
    efi: [135, 195],
    fermiP: 168,
    fermiN: 168,
    single: true,
    arrows: [
      { x: 455, y1: 70, y2: 130, t: 'eVbi' },
      { x: 150, y1: 135, y2: 168, t: 'ephiFp' },
      { x: 382, y1: 168, y2: 195, t: 'ephiFn' },
    ],
  },
  reverse: {
    ec: [60, 140],
    ev: [190, 270],
    efi: [125, 205],
    fermiP: 158,
    fermiN: 178,
    single: false,
    arrows: [
      { x: 465, y1: 60, y2: 140, t: 'eVbiVa' },
      { x: 150, y1: 125, y2: 158, t: 'ephiFp' },
      { x: 318, y1: 158, y2: 178, t: 'eVa' },
      { x: 392, y1: 178, y2: 205, t: 'ephiFn' },
    ],
  },
}

const DARK = '#334155'

export default function RecitationBandDiagram({ mode }: { mode: Mode }) {
  const c = CFG[mode]
  const fermiLabel = c.single ? 'F' : 'Fp'

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        {/* p / n side tags */}
        <text x={X0 + 6} y={28} className="fill-rose-400" style={{ fontSize: 13, fontWeight: 700 }}>p</text>
        <text x={X1 - 14} y={28} className="fill-sky-500" style={{ fontSize: 13, fontWeight: 700 }}>n</text>

        {/* E_Fi — dashed midgap */}
        <path d={band(c.efi[0], c.efi[1])} fill="none" stroke="#94a3b8" strokeWidth={1.25} strokeDasharray="6 4" />
        <text x={62} y={c.efi[0] + 4} textAnchor="end" className="fill-slate-400" style={{ fontSize: 13 }}>
          E<tspan dy={3} style={{ fontSize: 9 }}>Fi</tspan>
        </text>

        {/* Fermi level(s) */}
        {c.single ? (
          <>
            <line x1={X0} y1={c.fermiP} x2={X1} y2={c.fermiP} stroke={DARK} strokeWidth={1.5} />
            <text x={62} y={c.fermiP + 4} textAnchor="end" style={{ fontSize: 13, fontWeight: 700, fill: DARK }}>
              E<tspan dy={3} style={{ fontSize: 9 }}>F</tspan>
            </text>
          </>
        ) : (
          <>
            {/* E_Fp — p-side quasi-Fermi (left half, through junction) */}
            <line x1={X0} y1={c.fermiP} x2={360} y2={c.fermiP} stroke="#e11d48" strokeWidth={1.5} />
            <text x={62} y={c.fermiP + 4} textAnchor="end" className="fill-rose-600" style={{ fontSize: 13, fontWeight: 700 }}>
              E<tspan dy={3} style={{ fontSize: 9 }}>Fp</tspan>
            </text>
            {/* E_Fn — n-side quasi-Fermi (right half) */}
            <line x1={250} y1={c.fermiN} x2={X1} y2={c.fermiN} stroke="#0284c7" strokeWidth={1.5} />
            <text x={X1 + 6} y={c.fermiN + 4} className="fill-sky-700" style={{ fontSize: 13, fontWeight: 700 }}>
              E<tspan dy={3} style={{ fontSize: 9 }}>Fn</tspan>
            </text>
          </>
        )}

        {/* E_c / E_v — solid bands */}
        <path d={band(c.ec[0], c.ec[1])} fill="none" stroke="#0ea5e9" strokeWidth={2.5} strokeLinejoin="round" />
        <path d={band(c.ev[0], c.ev[1])} fill="none" stroke="#f43f5e" strokeWidth={2.5} strokeLinejoin="round" />
        <text x={62} y={c.ec[0] + 4} textAnchor="end" className="fill-sky-600" style={{ fontSize: 14, fontWeight: 700 }}>
          E<tspan dy={3} style={{ fontSize: 10 }}>c</tspan>
        </text>
        <text x={62} y={c.ev[0] + 4} textAnchor="end" className="fill-rose-500" style={{ fontSize: 14, fontWeight: 700 }}>
          E<tspan dy={3} style={{ fontSize: 10 }}>v</tspan>
        </text>

        {/* dimension arrows (double-headed) + labels */}
        {c.arrows.map((a, i) => {
          const ym = (a.y1 + a.y2) / 2
          return (
            <g key={i}>
              <line x1={a.x} y1={a.y1 + 1} x2={a.x} y2={a.y2 - 1} stroke={DARK} strokeWidth={1.4} markerStart="url(#rb-dim)" markerEnd="url(#rb-dim)" />
              <text x={a.x + 7} y={ym + 4} style={{ fontSize: 12.5, fontWeight: 600, fill: DARK }}>
                <DimLabel t={a.t} />
              </text>
            </g>
          )
        })}

        <defs>
          <marker id="rb-dim" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={DARK} />
          </marker>
        </defs>
      </svg>
    </div>
  )
}
