/**
 * The MOS band diagram BEFORE contact — metal | oxide | semiconductor drawn separately, with
 * their vacuum levels aligned (E₀), and the work functions / affinities as dimension arrows:
 *   Metal:         φ_M (E₀→E_Fm).
 *   Oxide (SiO₂):  χ_ox (E₀→E_c,ox) and a tall forbidden gap E_g,ox.
 *   p-Si:          χ_S (E₀→E_c), φ_S (E₀→E_F), E_c, E_i (dashed), E_F (p-type, below E_i), E_v.
 * Faithful to the lecturer's "נצייר בנפרד" figure. Pure schematic; subscripts via <tspan>.
 */
const W = 640
const H = 320
const SKY = '#0ea5e9'
const ROSE = '#f43f5e'
const SLATE = '#475569'
const TEAL = '#0369a1'
const TOP = 44
const BOT = 40
const yBot = H - BOT

// energy→y (eV scale, higher energy = smaller y). Vacuum at e=0.6 top.
const eTop = 0.7
const eBot = -4.7
const eToY = (e: number) => TOP + ((eTop - e) / (eTop - eBot)) * (H - TOP - BOT)

// column x-ranges
const mX0 = 30
const mX1 = 150
const oX0 = 190
const oX1 = 330
const sX0 = 372
const sX1 = 600

// representative energies (eV below vacuum)
// drawing heights (compressed χ so the band region stays readable; arrow LENGTHS are artistic)
const PHI_M = 2.7 // Al
const CHI_OX = 0.55 // SiO₂ affinity (schematic)
const EG_OX = 3.5 // SiO₂ gap (schematic, compressed)
const CHI_S = 2.4 // Si
const EG_S = 1.12
const PHI_F = 0.42 // p-type → E_F below E_i

function Dim({ x, e1, e2, label, color, sub }: { x: number; e1: number; e2: number; label: string; color: string; sub?: string }) {
  return (
    <>
      <line x1={x} y1={eToY(e1)} x2={x} y2={eToY(e2)} stroke={color} strokeWidth={1.75} markerStart="url(#sep-cap)" markerEnd="url(#sep-cap)" />
      <text x={x + 5} y={(eToY(e1) + eToY(e2)) / 2 + 4} fill={color} style={{ fontSize: 13, fontWeight: 800 }}>{label}{sub && <tspan dy={3} style={{ fontSize: 8 }}>{sub}</tspan>}</text>
    </>
  )
}

export default function MosBandSeparated() {
  const eFm = -PHI_M
  // oxide bands (huge gap)
  const ecOx = -CHI_OX
  const evOx = -CHI_OX - EG_OX
  // semiconductor
  const ecS = -CHI_S
  const evS = -CHI_S - EG_S
  const eiS = -CHI_S - EG_S / 2
  const efS = eiS - PHI_F // p-type: E_F below E_i

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <defs>
          <marker id="sep-cap" viewBox="0 0 8 8" refX="6.6" refY="4" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M1,1 L7,4 L1,7 Z" fill="#475569" /></marker>
        </defs>
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={14} fill="#fcfcff" stroke="#eef2f7" />

        {/* vacuum level across all three */}
        <line x1={mX0} y1={eToY(0)} x2={sX1} y2={eToY(0)} stroke={SLATE} strokeWidth={1.5} strokeDasharray="7 4" />
        <text x={sX1 + 2} y={eToY(0) + 4} className="fill-slate-500" style={{ fontSize: 12, fontWeight: 700 }}>E<tspan dy={2} style={{ fontSize: 8 }}>0</tspan></text>
        <text x={(mX0 + sX1) / 2} y={eToY(0) - 8} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 11, fontWeight: 700 }}>רמת ואקום</text>

        {/* column headers */}
        <text x={(mX0 + mX1) / 2} y={28} textAnchor="middle" className="fill-slate-600" style={{ fontSize: 13, fontWeight: 800 }}>מתכת (M)</text>
        <text x={(oX0 + oX1) / 2} y={28} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 13, fontWeight: 800 }}>אוקסיד (O)</text>
        <text x={(sX0 + sX1) / 2} y={28} textAnchor="middle" className="fill-rose-600" style={{ fontSize: 13, fontWeight: 800 }}>p-Si (S)</text>

        {/* metal Fermi sea */}
        <rect x={mX0} y={eToY(eFm)} width={mX1 - mX0} height={yBot - eToY(eFm)} fill="#cbd5e1" fillOpacity={0.55} />
        <line x1={mX0} y1={eToY(eFm)} x2={mX1} y2={eToY(eFm)} stroke={SLATE} strokeWidth={2.25} />
        <text x={mX0 + 4} y={eToY(eFm) - 5} className="fill-slate-700" style={{ fontSize: 12, fontWeight: 700 }}>E<tspan dy={2} style={{ fontSize: 8 }}>Fm</tspan></text>
        <Dim x={mX0 + 30} e1={0} e2={eFm} label="φ" sub="M" color={SLATE} />

        {/* oxide bands */}
        <line x1={oX0} y1={eToY(ecOx)} x2={oX1} y2={eToY(ecOx)} stroke="#94a3b8" strokeWidth={2.5} />
        <line x1={oX0} y1={eToY(evOx)} x2={oX1} y2={eToY(evOx)} stroke="#94a3b8" strokeWidth={2.5} />
        <rect x={oX0} y={eToY(ecOx)} width={oX1 - oX0} height={eToY(evOx) - eToY(ecOx)} fill="#e2e8f0" fillOpacity={0.4} />
        <text x={(oX0 + oX1) / 2} y={(eToY(ecOx) + eToY(evOx)) / 2} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 10, fontWeight: 700 }}>E<tspan dy={2} style={{ fontSize: 7 }}>g,ox</tspan></text>
        {/* oxide band edges labelled E_c / E_v too */}
        <text x={oX1 + 3} y={eToY(ecOx) + 4} className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>E<tspan dy={2} style={{ fontSize: 7 }}>c</tspan></text>
        <text x={oX1 + 3} y={eToY(evOx) + 4} className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>E<tspan dy={2} style={{ fontSize: 7 }}>v</tspan></text>
        <Dim x={oX0 + 26} e1={0} e2={ecOx} label="χ" sub="ox" color={SLATE} />

        {/* semiconductor bands */}
        <rect x={sX0} y={eToY(ecS)} width={sX1 - sX0} height={eToY(evS) - eToY(ecS)} fill="#fff1f2" fillOpacity={0.6} />
        <line x1={sX0} y1={eToY(ecS)} x2={sX1} y2={eToY(ecS)} stroke={SKY} strokeWidth={3} />
        <line x1={sX0} y1={eToY(evS)} x2={sX1} y2={eToY(evS)} stroke={ROSE} strokeWidth={3} />
        <line x1={sX0} y1={eToY(eiS)} x2={sX1} y2={eToY(eiS)} stroke={SLATE} strokeWidth={1.25} strokeDasharray="4 3" />
        <line x1={sX0} y1={eToY(efS)} x2={sX1} y2={eToY(efS)} stroke="#0f172a" strokeWidth={1.5} strokeDasharray="6 3" />
        <text x={sX1 + 2} y={eToY(ecS) + 2} className="fill-sky-700" style={{ fontSize: 12, fontWeight: 700 }}>E<tspan dy={2} style={{ fontSize: 8 }}>c</tspan></text>
        <text x={sX1 + 2} y={eToY(eiS) + 4} className="fill-slate-500" style={{ fontSize: 12, fontWeight: 700 }}>E<tspan dy={2} style={{ fontSize: 8 }}>i</tspan></text>
        <text x={sX1 + 2} y={eToY(efS) - 3} className="fill-slate-800" style={{ fontSize: 12, fontWeight: 700 }}>E<tspan dy={2} style={{ fontSize: 8 }}>F</tspan></text>
        <text x={sX1 + 2} y={eToY(evS) + 15} className="fill-rose-600" style={{ fontSize: 12, fontWeight: 700 }}>E<tspan dy={2} style={{ fontSize: 8 }}>v</tspan></text>
        <Dim x={sX0 + 30} e1={0} e2={ecS} label="χ" sub="S" color={TEAL} />
        <Dim x={sX0 + 76} e1={0} e2={efS} label="φ" sub="S" color={TEAL} />
        {/* full band gap E_g (E_c → E_v) */}
        <Dim x={sX0 + 132} e1={ecS} e2={evS} label="E" sub="g" color={SLATE} />
      </svg>
    </div>
  )
}
