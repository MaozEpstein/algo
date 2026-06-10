/**
 * The two field-effect-transistor families side by side (lateral cross-sections), matching
 * the class-summary sketch: a conducting channel between Source and Drain whose conductivity
 * the Gate controls through a "capacitor".
 *   JFET   — the gate is a p⁺/n JUNCTION; its reverse-biased depletion region squeezes the channel.
 *   MOSFET — the gate is an INSULATED metal–SiO₂–semiconductor stack; its field induces the channel.
 * Pure schematic. Colours: n = sky, p⁺ = rose, oxide = hatched grey, metal/leads = slate,
 * depletion / induced channel = red dashed.
 */
const SKY = '#0ea5e9'
const ROSE = '#f43f5e'
const SLATE = '#334155'
const RED = '#ef4444'
const GREEN = '#059669'

// per-device local geometry
const bX0 = 70
const bX1 = 322
const bY0 = 150
const bY1 = 234
const cx = (bX0 + bX1) / 2
const yMid = (bY0 + bY1) / 2

function Terminal({ x, y, letter, he, dir }: { x: number; y: number; letter: string; he: string; dir: -1 | 1 }) {
  const ax = dir < 0 ? 'end' : 'start'
  return (
    <>
      <circle cx={x} cy={y} r={4} fill={SLATE} />
      <text x={x + dir * 6} y={y - 9} textAnchor={ax} className="fill-slate-800" style={{ fontSize: 16, fontWeight: 800 }}>{letter}</text>
      <text x={x + dir * 6} y={y + 15} textAnchor={ax} className="fill-slate-500" style={{ fontSize: 12 }}>{he}</text>
    </>
  )
}

function Device({ ox, kind }: { ox: number; kind: 'mosfet' | 'jfet' }) {
  return (
    <g transform={`translate(${ox},0)`}>
      <text x={cx} y={40} textAnchor="middle" className={kind === 'mosfet' ? 'fill-violet-600' : 'fill-sky-700'} style={{ fontSize: 18, fontWeight: 800 }}>
        {kind === 'mosfet' ? 'MOSFET' : 'JFET'}
      </text>
      <text x={cx} y={59} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 12.5 }}>
        {kind === 'mosfet' ? 'שער מבודד (MOS)' : 'שער-צומת (p⁺/n)'}
      </text>

      {/* semiconductor body (n) */}
      <rect x={bX0} y={bY0} width={bX1 - bX0} height={bY1 - bY0} fill={SKY} fillOpacity={0.16} stroke={SKY} strokeOpacity={0.55} strokeWidth={1.25} />
      <text x={bX0 + 16} y={bY1 - 13} className="fill-sky-700" style={{ fontSize: 13, fontWeight: 700 }}>{kind === 'mosfet' ? 'n-type (מצע)' : 'n-Si'}</text>

      {/* source / drain leads + terminals */}
      <line x1={bX0} y1={yMid} x2={32} y2={yMid} stroke={SLATE} strokeWidth={2.25} />
      <Terminal x={28} y={yMid} letter="S" he="מקור" dir={-1} />
      <line x1={bX1} y1={yMid} x2={bX1 + 36} y2={yMid} stroke={SLATE} strokeWidth={2.25} />
      <Terminal x={bX1 + 40} y={yMid} letter="D" he="ניקוז" dir={1} />

      {kind === 'jfet' ? (
        <>
          {/* depletion region: a half-ellipse WRAPPING the p⁺ on its sides and bottom
              (touches the surface on both sides, dips below the p⁺). Drawn behind the p⁺. */}
          <path d={`M 144 ${bY0} C 144 ${bY0 + 62}, 248 ${bY0 + 62}, 248 ${bY0}`} fill={RED} fillOpacity={0.09} stroke={RED} strokeWidth={2} strokeDasharray="6 4" />
          {/* p⁺ gate region embedded at the top surface (on top of the depletion) */}
          <rect x={158} y={bY0} width={76} height={24} fill={ROSE} fillOpacity={0.32} stroke={ROSE} strokeOpacity={0.7} strokeWidth={1.25} />
          <text x={cx} y={bY0 + 18} textAnchor="middle" className="fill-rose-600" style={{ fontSize: 15, fontWeight: 800 }}>p⁺</text>
          {/* gate lead */}
          <line x1={cx} y1={bY0} x2={cx} y2={88} stroke={SLATE} strokeWidth={2.25} />
          <Terminal x={cx} y={84} letter="G" he="שער" dir={1} />
          <text x={cx} y={bY0 + 60} textAnchor="middle" className="fill-rose-500" style={{ fontSize: 12.5, fontWeight: 700 }}>שכבת המחסור</text>
        </>
      ) : (
        <>
          {/* depletion region: a WIDE but SHALLOW half-ellipse wrapping the full gate width */}
          <path d={`M 130 ${bY0} C 130 ${bY0 + 34}, 262 ${bY0 + 34}, 262 ${bY0}`} fill={RED} fillOpacity={0.09} stroke={RED} strokeWidth={2} strokeDasharray="6 4" />
          <text x={cx} y={bY0 + 50} textAnchor="middle" className="fill-rose-500" style={{ fontSize: 12.5, fontWeight: 700 }}>שכבת המחסור</text>
          {/* gate stack (metal + SiO₂), a moderate centred gate */}
          <rect x={136} y={bY0 - 15} width={120} height={15} fill="url(#fet-ox)" stroke={SLATE} strokeOpacity={0.45} strokeWidth={0.75} />
          <rect x={132} y={bY0 - 28} width={128} height={13} fill={SLATE} fillOpacity={0.82} />
          {/* material labels: metal gate (left) + insulating oxide (right) */}
          <text x={128} y={bY0 - 19} textAnchor="end" className="fill-slate-600" style={{ fontSize: 12, fontWeight: 700 }}>מתכת (שער)</text>
          <line x1={258} y1={bY0 - 8} x2={278} y2={bY0 - 10} stroke="#94a3b8" strokeWidth={1} />
          <text x={281} y={bY0 - 12} className="fill-slate-600" style={{ fontSize: 12.5, fontWeight: 700 }}>SiO₂</text>
          <text x={281} y={bY0 + 2} className="fill-slate-400" style={{ fontSize: 10.5 }}>(מבודד)</text>
          {/* gate lead */}
          <line x1={cx} y1={bY0 - 28} x2={cx} y2={88} stroke={SLATE} strokeWidth={2.25} />
          <Terminal x={cx} y={84} letter="G" he="שער" dir={1} />
          {/* channel-length arrow = the whole n-channel (source to drain) */}
          <line x1={bX0 + 12} y1={bY1 + 14} x2={bX1 - 12} y2={bY1 + 14} stroke={GREEN} strokeWidth={1.75} markerStart="url(#fet-a)" markerEnd="url(#fet-a)" />
          <text x={cx} y={bY1 + 30} textAnchor="middle" fill={GREEN} style={{ fontSize: 12.5, fontWeight: 700 }}>אורך התעלה L</text>
          {/* V_DS source — tidy battery loop S→D */}
          <path d={`M 28 ${yMid + 8} L 28 ${bY1 + 64} L ${cx - 16} ${bY1 + 64} M ${cx + 16} ${bY1 + 64} L ${bX1 + 40} ${bY1 + 64} L ${bX1 + 40} ${yMid + 8}`} fill="none" stroke={SLATE} strokeWidth={1.5} strokeOpacity={0.6} strokeLinejoin="round" />
          {/* battery: long (+) thin plate, short (−) thick plate */}
          <line x1={cx - 16} y1={bY1 + 52} x2={cx - 16} y2={bY1 + 76} stroke={SLATE} strokeWidth={1.75} />
          <line x1={cx + 16} y1={bY1 + 58} x2={cx + 16} y2={bY1 + 70} stroke={SLATE} strokeWidth={4} />
          <text x={cx - 22} y={bY1 + 50} textAnchor="end" className="fill-slate-400" style={{ fontSize: 11, fontWeight: 700 }}>+</text>
          <text x={cx} y={bY1 + 92} textAnchor="middle" className="fill-slate-700" style={{ fontSize: 14, fontWeight: 800 }}>V<tspan dy={3} style={{ fontSize: 9.5 }}>DS</tspan></text>
        </>
      )}
    </g>
  )
}

export default function FetStructures() {
  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox="0 0 840 360" className="mx-auto w-full" style={{ maxWidth: 840 }}>
        <defs>
          <pattern id="fet-ox" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="#e2e8f0" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="#94a3b8" strokeWidth="1.2" />
          </pattern>
          <marker id="fet-a" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M1,1 L9,5 L1,9" fill="none" stroke={GREEN} strokeWidth="1.6" />
          </marker>
        </defs>
        <rect x={2} y={2} width={836} height={356} rx={14} fill="#fcfcff" stroke="#eef2f7" />
        <Device ox={18} kind="mosfet" />
        <Device ox={438} kind="jfet" />
        <line x1={420} y1={36} x2={420} y2={324} stroke="#e2e8f0" strokeWidth={1} strokeDasharray="4 4" />
      </svg>
    </div>
  )
}
