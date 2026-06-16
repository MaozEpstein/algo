/**
 * Faithful static reproduction of the תרגול-4 device structure: a low-doped Si
 * bar with hatched metal contacts on both sides (a metal–semiconductor–metal,
 * back-to-back Schottky structure). `biased` adds the external V_A source and the
 * contact labels 1 / 2 used in part ג. Pure SVG.
 */
const STROKE = '#334155'

export default function MsmStructure({ biased = false }: { biased?: boolean }) {
  const L = 110, R = 330, T = biased ? 70 : 40, B = T + 70 // Si box
  const mW = 18 // metal-contact width
  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 440 ${biased ? 200 : 170}`} className="mx-auto w-full" style={{ maxWidth: 440 }}>
        <defs>
          <pattern id="msm-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke={STROKE} strokeWidth="1.4" />
          </pattern>
        </defs>

        {/* semiconductor bar */}
        <rect x={L} y={T} width={R - L} height={B - T} fill="none" stroke={STROKE} strokeWidth={2} />
        <text x={(L + R) / 2} y={T + 26} textAnchor="middle" style={{ fontSize: 15, fontWeight: 700, fill: STROKE }}>Si</text>

        {/* two metal contacts (hatched) */}
        <rect x={L - mW} y={T} width={mW} height={B - T} fill="url(#msm-hatch)" stroke={STROKE} strokeWidth={2} />
        <rect x={R} y={T} width={mW} height={B - T} fill="url(#msm-hatch)" stroke={STROKE} strokeWidth={2} />

        {/* 5 µm dimension arrow (double-headed) */}
        <line x1={L + 6} y1={B - 16} x2={R - 6} y2={B - 16} stroke={STROKE} strokeWidth={1.3} markerStart="url(#msm-dim)" markerEnd="url(#msm-dim)" />
        <text x={(L + R) / 2} y={B - 21} textAnchor="middle" style={{ fontSize: 13, fontWeight: 600, fill: STROKE }}>5 µm</text>
        <marker id="msm-dim" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={STROKE} />
        </marker>

        {biased && (
          <>
            {/* external V_A source wired across the two metal contacts */}
            <line x1={L - mW / 2} y1={T} x2={L - mW / 2} y2={30} stroke={STROKE} strokeWidth={2} />
            <line x1={L - mW / 2} y1={30} x2={205} y2={30} stroke={STROKE} strokeWidth={2} />
            <line x1={245} y1={30} x2={R + mW / 2} y2={30} stroke={STROKE} strokeWidth={2} />
            <line x1={R + mW / 2} y1={30} x2={R + mW / 2} y2={T} stroke={STROKE} strokeWidth={2} />
            {/* battery symbol */}
            <line x1={205} y1={20} x2={205} y2={40} stroke={STROKE} strokeWidth={2.5} />
            <line x1={213} y1={25} x2={213} y2={35} stroke={STROKE} strokeWidth={2.5} />
            <line x1={221} y1={20} x2={221} y2={40} stroke={STROKE} strokeWidth={2.5} />
            <line x1={229} y1={25} x2={229} y2={35} stroke={STROKE} strokeWidth={2.5} />
            <text x={205} y={14} textAnchor="middle" style={{ fontSize: 13, fontWeight: 600, fill: STROKE }}>V<tspan dy={3} style={{ fontSize: 9 }}>A</tspan></text>
            {/* contact labels 1 / 2 */}
            <text x={L - mW / 2} y={B + 16} textAnchor="middle" style={{ fontSize: 13, fontWeight: 700, fill: '#7c3aed' }}>1</text>
            <text x={R + mW / 2} y={B + 16} textAnchor="middle" style={{ fontSize: 13, fontWeight: 700, fill: '#7c3aed' }}>2</text>
          </>
        )}
      </svg>
    </div>
  )
}
