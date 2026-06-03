/**
 * Zener (band-to-band tunneling) breakdown. Under a large reverse bias on a
 * HEAVILY-doped junction the depletion region is very thin and the bands tilt
 * steeply, until the p-side valence band overlaps (in energy) the n-side
 * conduction band. An electron then tunnels HORIZONTALLY (at constant energy)
 * straight through the thin forbidden gap. Schematic SVG.
 */
const W = 520
const H = 250
const DL = 210 // depletion left edge (x)
const DR = 270 // depletion right edge (x) — narrow!

// band edges: flat in the neutral regions, steeply tilted across the depletion
const EC = `M 44,70 L ${DL},70 L ${DR},160 L 476,160`
const EV = `M 44,136 L ${DL},136 L ${DR},226 L 476,226`
// tunnelling level y=148: where p-valence edge (x≈218) meets n-conduction edge (x≈262)
const TY = 148
const TX1 = 218
const TX2 = 262

export default function ZenerTunnelingDiagram() {
  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <defs>
          <marker id="zt-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#16a34a" />
          </marker>
        </defs>

        {/* narrow depletion strip */}
        <rect x={DL} y={40} width={DR - DL} height={196} fill="#ede9fe" opacity={0.75} />
        <text x={240} y={32} textAnchor="middle" className="fill-violet-600" style={{ fontSize: 12, fontWeight: 700 }}>
          שדה עצום · מחסור צר מאוד
        </text>
        <text x={120} y={60} textAnchor="middle" className="fill-rose-400" style={{ fontSize: 13, fontWeight: 700 }}>p</text>
        <text x={380} y={150} textAnchor="middle" className="fill-sky-500" style={{ fontSize: 13, fontWeight: 700 }}>n</text>

        {/* band edges */}
        <path d={EC} fill="none" stroke="#0ea5e9" strokeWidth={2.5} strokeLinejoin="round" />
        <path d={EV} fill="none" stroke="#f43f5e" strokeWidth={2.5} strokeLinejoin="round" />
        <text x={480} y={158} className="fill-sky-600" style={{ fontSize: 14, fontWeight: 700 }}>
          E<tspan dy={3} style={{ fontSize: 10 }}>c</tspan>
        </text>
        <text x={480} y={224} className="fill-rose-500" style={{ fontSize: 14, fontWeight: 700 }}>
          E<tspan dy={3} style={{ fontSize: 10 }}>v</tspan>
        </text>
        <text x={64} y={62} className="fill-sky-600" style={{ fontSize: 12, fontWeight: 700 }}>
          E<tspan dy={3} style={{ fontSize: 9 }}>c</tspan>
        </text>
        <text x={64} y={132} className="fill-rose-500" style={{ fontSize: 12, fontWeight: 700 }}>
          E<tspan dy={3} style={{ fontSize: 9 }}>v</tspan>
        </text>

        {/* the tunnelling electron — horizontal (constant-energy) through the thin gap */}
        <line x1={TX1} y1={TY} x2={TX2} y2={TY} stroke="#16a34a" strokeWidth={2.5} strokeDasharray="5 3" markerEnd="url(#zt-arrow)" />
        <circle cx={TX1} cy={TY} r={6.5} fill="#0ea5e9" />
        <text x={TX1} y={TY + 3.5} textAnchor="middle" fill="white" style={{ fontSize: 10, fontWeight: 800 }}>−</text>
        <text x={240} y={128} textAnchor="middle" className="fill-emerald-700" style={{ fontSize: 12, fontWeight: 700 }}>
          מנהור פס-לפס
        </text>

        {/* width marker for the thin barrier */}
        <line x1={DL} y1={236} x2={DR} y2={236} stroke="#7c3aed" strokeWidth={1.25} markerStart="url(#zt-cap)" markerEnd="url(#zt-cap)" />
        <text x={240} y={248} textAnchor="middle" className="fill-violet-600" style={{ fontSize: 10.5, fontWeight: 700 }}>
          מחסום צר → מנהור אפשרי
        </text>
        <defs>
          <marker id="zt-cap" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M5,0 L5,10" stroke="#7c3aed" strokeWidth="2" />
          </marker>
        </defs>
      </svg>
    </div>
  )
}
