/**
 * Faithful static reproduction of the תרגול-4 energy-band diagrams of the
 * metal–semiconductor–metal (back-to-back Schottky) structure.
 *   mode='eq'   — equilibrium: flat E_F, symmetric barriers φ_B, bending φ_MS,
 *                 bulk offset Δφ, depletion W on both sides.
 *   mode='bias' — V_A applied: E_F splits (E_F1/E_F2), junction 1 forward (small
 *                 bending, W1), junction 2 reverse (large bending, W2), V1/V2.
 * All labeled gaps are drawn with double-headed dimension arrows. Pure SVG.
 */
const DARK = '#334155'
const SKY = '#0ea5e9'
const ROSE = '#f43f5e'
const VIOLET = '#7c3aed'

const W = 600
const H = 320
const ML = 120 // left metal / SC interface
const MR = 480 // right metal / SC interface
const EG = 118 // band gap (px)

function ecPath(yLc: number, wL: number, yBulk: number, wR: number, yRc: number): string {
  return `M ${ML},${yLc} C ${ML + 26},${yLc} ${ML + wL - 16},${yBulk} ${ML + wL},${yBulk} L ${MR - wR},${yBulk} C ${MR - wR + 16},${yBulk} ${MR - 26},${yRc} ${MR},${yRc}`
}

function VArrow({ x, y1, y2, color = DARK, children }: { x: number; y1: number; y2: number; color?: string; children: React.ReactNode }) {
  return (
    <>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={color} strokeWidth={1.3} markerStart="url(#msb-dim)" markerEnd="url(#msb-dim)" />
      <text x={x + 6} y={(y1 + y2) / 2 + 4} style={{ fontSize: 13, fontWeight: 600, fill: color }}>{children}</text>
    </>
  )
}
function HArrow({ x1, x2, y, children }: { x1: number; x2: number; y: number; children: React.ReactNode }) {
  return (
    <>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={DARK} strokeWidth={1.3} markerStart="url(#msb-dim)" markerEnd="url(#msb-dim)" />
      <text x={(x1 + x2) / 2} y={y - 5} textAnchor="middle" style={{ fontSize: 12, fontWeight: 600, fill: DARK }}>{children}</text>
    </>
  )
}
const subT = (s: string) => <tspan dy={3} style={{ fontSize: 9 }}>{s}</tspan>

export default function MsmBandDiagram({ mode }: { mode: 'eq' | 'bias' }) {
  const Defs = (
    <defs>
      <marker id="msb-dim" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill={DARK} />
      </marker>
      <pattern id="msb-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="6" stroke="#cbd5e1" strokeWidth="1.4" />
      </pattern>
    </defs>
  )

  if (mode === 'eq') {
    const yF = 168
    const yEcContact = 84 // φ_B = 84px above E_F
    const yEcBulk = 122 // Δφ = 46px above E_F
    const wB = 72
    return (
      <div className="ltr w-full" dir="ltr">
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
          {Defs}
          {/* M / S / M region tags */}
          <text x={(60 + ML) / 2} y={36} textAnchor="middle" style={{ fontSize: 14, fontWeight: 700, fill: DARK }}>M</text>
          <text x={(ML + MR) / 2} y={36} textAnchor="middle" style={{ fontSize: 14, fontWeight: 700, fill: DARK }}>S</text>
          <text x={(MR + 540) / 2} y={36} textAnchor="middle" style={{ fontSize: 14, fontWeight: 700, fill: DARK }}>M</text>
          {/* E_vac */}
          <line x1={60} y1={26} x2={540} y2={26} stroke={DARK} strokeWidth={1} strokeDasharray="6 4" />
          <text x={543} y={30} style={{ fontSize: 12, fill: DARK }}>E<tspan dy={3} style={{ fontSize: 9 }}>vac</tspan></text>

          {/* metals: Fermi sea */}
          <rect x={60} y={yF} width={ML - 60} height={H - yF - 6} fill="url(#msb-hatch)" stroke="#cbd5e1" />
          <rect x={MR} y={yF} width={540 - MR} height={H - yF - 6} fill="url(#msb-hatch)" stroke="#cbd5e1" />

          {/* E_F flat */}
          <line x1={60} y1={yF} x2={540} y2={yF} stroke={DARK} strokeWidth={1.5} strokeDasharray="7 0" />
          <text x={543} y={yF + 4} style={{ fontSize: 13, fontWeight: 700, fill: DARK }}>E<tspan dy={3} style={{ fontSize: 9 }}>F</tspan></text>

          {/* E_c / E_v valleys */}
          <path d={ecPath(yEcContact, wB, yEcBulk, wB, yEcContact)} fill="none" stroke={SKY} strokeWidth={2.5} />
          <path d={ecPath(yEcContact + EG, wB, yEcBulk + EG, wB, yEcContact + EG)} fill="none" stroke={ROSE} strokeWidth={2.5} />
          <text x={(ML + MR) / 2 + 8} y={yEcBulk - 7} textAnchor="middle" style={{ fontSize: 13, fontWeight: 700, fill: SKY }}>E<tspan dy={3} style={{ fontSize: 9 }}>c</tspan></text>
          <text x={(ML + MR) / 2 + 8} y={yEcBulk + EG + 16} textAnchor="middle" style={{ fontSize: 13, fontWeight: 700, fill: ROSE }}>E<tspan dy={3} style={{ fontSize: 9 }}>v</tspan></text>

          {/* labels: φ_B (left), φ_MS (left bending), Δφ (bulk), W both */}
          <VArrow x={ML + 12} y1={yF} y2={yEcContact}>φ{subT('B')}</VArrow>
          <VArrow x={ML + wB} y1={yEcContact} y2={yEcBulk} color={VIOLET}>φ{subT('MS')}</VArrow>
          <VArrow x={(ML + MR) / 2 - 70} y1={yEcBulk} y2={yF}>Δφ</VArrow>
          <HArrow x1={ML} x2={ML + wB} y={yEcBulk + 40}>W</HArrow>
          <HArrow x1={MR - wB} x2={MR} y={yEcBulk + 40}>W</HArrow>
        </svg>
      </div>
    )
  }

  // mode === 'bias'
  const yF1 = 206 // left metal E_F (low)
  const yF2 = 120 // right metal E_F (high), offset = V_A
  const phiB = 84
  const yEcL = yF1 - phiB // 122 — left contact E_c
  const yEcR = yF2 - phiB // 36  — right contact E_c
  const yEcBulk = 150 // flat bulk E_c
  const wL = 46 // W1 small (forward)
  const wR = 96 // W2 large (reverse)
  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        {Defs}
        <text x={(60 + ML) / 2} y={252} textAnchor="middle" style={{ fontSize: 13, fontWeight: 700, fill: VIOLET }}>1</text>
        <text x={(MR + 540) / 2} y={30} textAnchor="middle" style={{ fontSize: 13, fontWeight: 700, fill: VIOLET }}>2</text>

        {/* metals (Fermi seas at the two split levels) */}
        <rect x={60} y={yF1} width={ML - 60} height={H - yF1 - 6} fill="url(#msb-hatch)" stroke="#cbd5e1" />
        <rect x={MR} y={yF2} width={540 - MR} height={H - yF2 - 6} fill="url(#msb-hatch)" stroke="#cbd5e1" />

        {/* split quasi-Fermi levels */}
        <line x1={60} y1={yF1} x2={ML + wL + 40} y2={yF1} stroke={DARK} strokeWidth={1.5} />
        <text x={70} y={yF1 + 16} style={{ fontSize: 12, fontWeight: 700, fill: DARK }}>E<tspan dy={3} style={{ fontSize: 9 }}>F1</tspan></text>
        <line x1={MR - wR - 40} y1={yF2} x2={540} y2={yF2} stroke={DARK} strokeWidth={1.5} />
        <text x={543} y={yF2 + 4} style={{ fontSize: 12, fontWeight: 700, fill: DARK }}>E<tspan dy={3} style={{ fontSize: 9 }}>F2</tspan></text>

        {/* E_c / E_v (asymmetric bending) */}
        <path d={ecPath(yEcL, wL, yEcBulk, wR, yEcR)} fill="none" stroke={SKY} strokeWidth={2.5} />
        <path d={ecPath(yEcL + EG, wL, yEcBulk + EG, wR, yEcR + EG)} fill="none" stroke={ROSE} strokeWidth={2.5} />
        <text x={300} y={yEcBulk - 7} textAnchor="middle" style={{ fontSize: 13, fontWeight: 700, fill: SKY }}>E<tspan dy={3} style={{ fontSize: 9 }}>c</tspan></text>

        {/* labels */}
        <VArrow x={ML + 12} y1={yF1} y2={yEcL}>φ{subT('B')}</VArrow>
        <VArrow x={MR - 12} y1={yF2} y2={yEcR}>φ{subT('B')}</VArrow>
        <VArrow x={ML + wL + 26} y1={yEcBulk} y2={yF1}>V{subT('1')}</VArrow>
        <VArrow x={MR - wR - 26} y1={yF2} y2={yF1} color={VIOLET}>V{subT('2')}</VArrow>
        <VArrow x={300 - 64} y1={yEcBulk} y2={yEcBulk - 46}>Δφ</VArrow>
        <HArrow x1={ML} x2={ML + wL} y={yEcBulk + 42}>W{subT('1')}</HArrow>
        <HArrow x1={MR - wR} x2={MR} y={yEcBulk + 42}>W{subT('2')}</HArrow>
      </svg>
    </div>
  )
}
