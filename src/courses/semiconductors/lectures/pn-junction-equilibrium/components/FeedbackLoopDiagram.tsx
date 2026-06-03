/**
 * Why the depletion region self-stabilizes: a negative-feedback loop. Diffusion
 * exposes fixed ions → a built-in field grows → it drives an opposing drift →
 * which throttles the very diffusion that started it. The closing arrow (rose,
 * marked −) is the feedback that brakes the loop into equilibrium. Static SVG.
 */
const W = 460
const H = 300

type Node = { cx: number; cy: number; title: string; sub: string }
const NODES: Node[] = [
  { cx: 132, cy: 72, title: 'דיפוזיה', sub: 'נושאי רוב חוצים' },
  { cx: 328, cy: 72, title: 'חשיפת יונים', sub: 'מטען קבוע נחשף' },
  { cx: 328, cy: 228, title: 'שדה בנוי E', sub: 'מכוּון n → p' },
  { cx: 132, cy: 228, title: 'סחיפה מנוגדת', sub: 'דוחפת בחזרה' },
]
const HW = 66
const HH = 24

export default function FeedbackLoopDiagram() {
  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <defs>
          <marker id="fb-sky" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#0ea5e9" />
          </marker>
          <marker id="fb-rose" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#f43f5e" />
          </marker>
        </defs>

        {/* cycle arrows (clockwise): A→B→C→D, then the feedback D→A */}
        <line x1={198} y1={72} x2={258} y2={72} stroke="#0ea5e9" strokeWidth={2.25} markerEnd="url(#fb-sky)" />
        <line x1={328} y1={96} x2={328} y2={200} stroke="#0ea5e9" strokeWidth={2.25} markerEnd="url(#fb-sky)" />
        <line x1={262} y1={228} x2={202} y2={228} stroke="#0ea5e9" strokeWidth={2.25} markerEnd="url(#fb-sky)" />
        <line x1={132} y1={204} x2={132} y2={100} stroke="#f43f5e" strokeWidth={2.5} markerEnd="url(#fb-rose)" />

        {/* negative-feedback marker on the closing arrow */}
        <circle cx={132} cy={150} r={10} fill="#f43f5e" />
        <text x={132} y={155} textAnchor="middle" fill="white" style={{ fontSize: 15, fontWeight: 800 }}>−</text>

        {/* center label */}
        <text x={246} y={146} textAnchor="middle" className="fill-violet-700" style={{ fontSize: 15, fontWeight: 800 }}>
          ↻ משוב שלילי
        </text>
        <text x={246} y={166} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 11, fontWeight: 600 }}>
          מתכנס לשיווי-משקל
        </text>

        {/* nodes */}
        {NODES.map((n, i) => (
          <g key={i}>
            <rect x={n.cx - HW} y={n.cy - HH} width={HW * 2} height={HH * 2} rx={10} fill="#eff6ff" stroke="#93c5fd" strokeWidth={1.5} />
            <text x={n.cx} y={n.cy - 2} textAnchor="middle" className="fill-sky-700" style={{ fontSize: 14, fontWeight: 800 }}>
              {n.title}
            </text>
            <text x={n.cx} y={n.cy + 14} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 10.5 }}>
              {n.sub}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
