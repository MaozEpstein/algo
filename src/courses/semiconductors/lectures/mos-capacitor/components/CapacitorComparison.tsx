/**
 * Parallel-plate capacitor ↔ MOS capacitor, side by side, each column showing the structure,
 * the charge density ρ(x) and the field E(x) — vertically aligned (shared x), exactly like the
 * summary. The analogy: the oxide is the capacitor's gap (constant E); but on the semiconductor
 * side the charge spreads over a depletion width, so E decays linearly instead of being a sheet.
 * Pure schematic.
 */
const W = 760
const H = 430
const SLATE = '#334155'
const ROSE = '#e11d48'
const SKY = '#0284c7'
const GREEN = '#059669'

const yS0 = 50
const yS1 = 116 // structure band
const yRho = 218 // ρ axis
const yE = 388 // E axis
const HBAR = 46 // charge/field bar height
const yGuideTop = 46
const yGuideBot = yE + 6

function Guide({ x }: { x: number }) {
  return <line x1={x} y1={yGuideTop} x2={x} y2={yGuideBot} stroke="#e2e8f0" strokeWidth={1} strokeDasharray="3 3" />
}
function Axis({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  return <line x1={x0} y1={y} x2={x1} y2={y} stroke="#cbd5e1" strokeWidth={1.25} />
}

export default function CapacitorComparison() {
  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <defs>
          <pattern id="cmp-ox" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="#e2e8f0" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="#94a3b8" strokeWidth="1" />
          </pattern>
        </defs>
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={14} fill="#fcfdff" stroke="#eef2f7" />

        {/* row labels (right side, RTL) */}
        <text x={W - 10} y={(yS0 + yS1) / 2 + 4} textAnchor="end" className="fill-slate-400" style={{ fontSize: 11, fontWeight: 700 }}>מבנה</text>
        <text x={W - 10} y={yRho - 30} textAnchor="end" className="fill-slate-400" style={{ fontSize: 11, fontWeight: 700 }}>ρ(x)</text>
        <text x={W - 10} y={yE - HBAR - 8} textAnchor="end" className="fill-slate-400" style={{ fontSize: 11, fontWeight: 700 }}>E(x)</text>
        <line x1={368} y1={30} x2={368} y2={H - 16} stroke="#e2e8f0" strokeWidth={1} />

        {/* ===================== LEFT: parallel-plate capacitor ===================== */}
        <g transform="translate(8,0)">
          <text x={185} y={32} textAnchor="middle" className="fill-slate-700" style={{ fontSize: 14, fontWeight: 800 }}>קבל לוחות</text>
          {(() => { const xA = 130, xB = 252; return (
            <>
              <Guide x={xA} /><Guide x={xB} />
              {/* structure: two plates + V */}
              <line x1={xA} y1={yS0} x2={xA} y2={yS1} stroke={SLATE} strokeWidth={4} />
              <line x1={xB} y1={yS0} x2={xB} y2={yS1} stroke={SLATE} strokeWidth={4} />
              <text x={xA - 8} y={yS0 + 4} textAnchor="end" fill={ROSE} style={{ fontSize: 13, fontWeight: 800 }}>+</text>
              <text x={xB + 8} y={yS0 + 4} textAnchor="start" fill={SKY} style={{ fontSize: 13, fontWeight: 800 }}>−</text>
              <path d={`M ${xA} ${yS1} L ${xA} ${yS1 + 18} L ${(xA + xB) / 2 - 8} ${yS1 + 18} M ${(xA + xB) / 2 + 8} ${yS1 + 18} L ${xB} ${yS1 + 18} L ${xB} ${yS1}`} fill="none" stroke={SLATE} strokeWidth={1.5} />
              <line x1={(xA + xB) / 2 - 8} y1={yS1 + 10} x2={(xA + xB) / 2 - 8} y2={yS1 + 26} stroke={SLATE} strokeWidth={1.5} />
              <line x1={(xA + xB) / 2 + 8} y1={yS1 + 13} x2={(xA + xB) / 2 + 8} y2={yS1 + 23} stroke={SLATE} strokeWidth={3} />
              <text x={(xA + xB) / 2} y={yS1 + 40} textAnchor="middle" className="fill-slate-600" style={{ fontSize: 12, fontWeight: 800 }}>V</text>
              {/* ρ(x): +Q sheet at A, −Q sheet at B */}
              <Axis x0={70} x1={320} y={yRho} />
              <rect x={xA - 5} y={yRho - HBAR} width={10} height={HBAR} fill={ROSE} fillOpacity={0.3} stroke={ROSE} strokeWidth={1.25} />
              <text x={xA} y={yRho - HBAR - 5} textAnchor="middle" fill={ROSE} style={{ fontSize: 10.5, fontWeight: 800 }}>+Q</text>
              <rect x={xB - 5} y={yRho} width={10} height={HBAR} fill={SKY} fillOpacity={0.3} stroke={SKY} strokeWidth={1.25} />
              <text x={xB} y={yRho + HBAR + 14} textAnchor="middle" fill={SKY} style={{ fontSize: 10.5, fontWeight: 800 }}>−Q</text>
              {/* E(x): constant between plates */}
              <Axis x0={70} x1={320} y={yE} />
              <path d={`M ${xA} ${yE} L ${xA} ${yE - HBAR} L ${xB} ${yE - HBAR} L ${xB} ${yE}`} fill={GREEN} fillOpacity={0.12} stroke={GREEN} strokeWidth={1.75} />
              <text x={(xA + xB) / 2} y={yE - HBAR + 16} textAnchor="middle" fill={GREEN} style={{ fontSize: 10.5, fontWeight: 700 }}>E קבוע</text>
            </>
          ) })()}
        </g>

        {/* ===================== RIGHT: MOS capacitor ===================== */}
        <g transform="translate(376,0)">
          <text x={185} y={32} textAnchor="middle" className="fill-violet-600" style={{ fontSize: 14, fontWeight: 800 }}>קבל MOS</text>
          {(() => { const xM = 80, xO = 150, xD = 256; return (
            <>
              <Guide x={xM} /><Guide x={xO} /><Guide x={xD} />
              {/* structure: metal | oxide | p-Si */}
              <rect x={xM - 8} y={yS0} width={8} height={yS1 - yS0} fill={SLATE} fillOpacity={0.82} />
              <rect x={xM} y={yS0} width={xO - xM} height={yS1 - yS0} fill="url(#cmp-ox)" stroke="#94a3b8" strokeOpacity={0.5} strokeWidth={0.75} />
              <rect x={xO} y={yS0} width={320 - xO} height={yS1 - yS0} fill={ROSE} fillOpacity={0.1} stroke={ROSE} strokeOpacity={0.35} />
              <text x={xM - 12} y={(yS0 + yS1) / 2 + 4} textAnchor="end" className="fill-slate-600" style={{ fontSize: 10, fontWeight: 700 }}>M</text>
              <text x={(xM + xO) / 2} y={yS0 - 4} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 9.5, fontWeight: 700 }}>SiO₂</text>
              <text x={(xO + 320) / 2} y={(yS0 + yS1) / 2 + 4} textAnchor="middle" className="fill-rose-600" style={{ fontSize: 11, fontWeight: 800 }}>p-Si</text>
              {/* ρ(x): +Q sheet on metal, −Q depletion box in Si */}
              <Axis x0={50} x1={330} y={yRho} />
              <rect x={xM - 5} y={yRho - HBAR} width={10} height={HBAR} fill={ROSE} fillOpacity={0.3} stroke={ROSE} strokeWidth={1.25} />
              <text x={xM} y={yRho - HBAR - 5} textAnchor="middle" fill={ROSE} style={{ fontSize: 10.5, fontWeight: 800 }}>+Q</text>
              <rect x={xO} y={yRho} width={xD - xO} height={HBAR * 0.8} fill={SKY} fillOpacity={0.22} stroke={SKY} strokeWidth={1.25} />
              <text x={(xO + xD) / 2} y={yRho + HBAR * 0.8 + 14} textAnchor="middle" fill={SKY} style={{ fontSize: 10.5, fontWeight: 800 }}>−Q (דלדול)</text>
              {/* E(x): constant in oxide, linear decay in depletion */}
              <Axis x0={50} x1={330} y={yE} />
              <path d={`M ${xM} ${yE} L ${xM} ${yE - HBAR} L ${xO} ${yE - HBAR} L ${xD} ${yE}`} fill={GREEN} fillOpacity={0.12} stroke={GREEN} strokeWidth={1.75} />
              <text x={(xM + xO) / 2} y={yE - HBAR - 5} textAnchor="middle" fill={GREEN} style={{ fontSize: 9.5, fontWeight: 700 }}>קבוע באוקסיד</text>
              <text x={xD + 4} y={yE - 6} textAnchor="start" fill={GREEN} style={{ fontSize: 9.5, fontWeight: 700 }}>דועך בדלדול</text>
            </>
          ) })()}
        </g>
      </svg>
    </div>
  )
}
